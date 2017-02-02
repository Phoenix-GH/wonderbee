import React, { Component, PropTypes } from 'react';
import {
  View,
  Animated,
  Image,
  Platform,
  LayoutAnimation,
  NativeModules,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CameraTopBar, CameraBottomBar } from 'AppComponents';
import {
  CAPTURE_VIDEO,
  CAPTURE_PICTURE,
  WINDOW_WIDTH,
  REC_BUTTON_FRAME,
  REC_ANIMATION_DELAY_TIME,
  REC_ANIMATION_LIMIT_TIME,
  REC_PATH_AMOUNT,
  CAMERA_ROLL_PHOTOS,
  CAMERA_ROLL_VIDEOS,
} from 'AppConstants';
import { toggle } from 'AppUtilities';
import { styles } from './styles';

const CameraManager = NativeModules.CameraManager || NativeModules.CameraModule;

const cameraFlashModeIcons = {
  [Camera.constants.FlashMode.off]: 'flash-off',
  [Camera.constants.FlashMode.auto]: 'flash-auto',
  [Camera.constants.FlashMode.on]: 'flash-on',
};

export class CameraContainer extends Component {
  static propTypes = {
    backTo: PropTypes.string,
    addImage: PropTypes.func.isRequired,
    removeAllImages: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    replaceCurrentScene: PropTypes.func.isRequired,
    resizeImage: PropTypes.func.isRequired,
    resizeAllImages: PropTypes.func.isRequired,
    clearImages: PropTypes.bool.isRequired,
    clearState: PropTypes.func.isRequired,

    setVideo: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      cameraOptions: {
        audio: false,
        type: Camera.constants.Type.back,
        flashMode: Camera.constants.FlashMode.auto,
        captureTarget: CameraManager.CaptureTarget.cameraRoll,
        defaultOnFocusComponent: true,
        captureQuality: Camera.constants.CaptureQuality.high,
        onFocusChanged: () => {},
        onZoomChanged: () => {},
      },
      picture: {},
      cameraOpacity: new Animated.Value(1),
      isReviewMode: false,
      recordedData: null,
      videoPaused: true,
      progress: 1.0,
    };
    this.setCameraOptions = ::this.setCameraOptions;
    this.flipPicture = ::this.flipPicture;
    this.toggleFlash = ::this.toggleFlash;
    this.onHoldTakePictureButton = ::this.onHoldTakePictureButton;
    this.handlePressOut = ::this.handlePressOut;
    this.capture = ::this.capture;
    this.videoCapture = ::this.videoCapture;
    this.onRetake = ::this.onRetake;
    this.doneCapturing = ::this.doneCapturing;
    this.routeCameraRoll = ::this.routeCameraRoll;
    this.camera = null;
    this._captureMode = CAPTURE_PICTURE;
    this._timer = null;
  }

  componentWillMount() {
    if (this.props.clearImages) {
      this.props.removeAllImages();
    }
  }

  componentDidMount() {
    // THIS IS A HACK TO MAKE RESET CAMERA FLASH SETTING TO AUTO
    StatusBar.setHidden(true);
    this.setCameraOptions({
      flashMode: Camera.constants.FlashMode.auto
    });
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  calcRecordTime() {
    this._recordTime += REC_ANIMATION_DELAY_TIME;
    if (this._recordTime > REC_ANIMATION_LIMIT_TIME*1000) {
      this.handlePressOut();
    } else {
      const progress = 1 - this._recordTime / (REC_ANIMATION_LIMIT_TIME*1000.0);
      this.setState({ progress });
    }
  }

  onRetake() {
    this._captureMode = CAPTURE_PICTURE;
    LayoutAnimation.spring();
    this.setState({ isReviewMode: false });
  }

  setCameraOptions(options) {
    this.setState({
      cameraOptions: {
        ...this.state.cameraOptions,
        ...options
      }
    });
  }

  routeCameraRoll(savePicture) {
    const { addImage, replaceCurrentScene, setVideo } = this.props;
    const { picture, recordedData } = this.state;
    const tab = this._captureMode === CAPTURE_PICTURE ? CAMERA_ROLL_PHOTOS : CAMERA_ROLL_VIDEOS;

    if (!savePicture) {
      return replaceCurrentScene('CameraRollScene', { backTo: 'CameraScene', tab});
    }

    if (this._captureMode === CAPTURE_PICTURE) {
      return addImage(picture)
        .then(() => replaceCurrentScene('CameraRollScene', { backTo: 'CameraScene', tab}));
    }

    return setVideo(recordedData)
        .then(() => replaceCurrentScene('CameraRollScene', { backTo: 'CameraScene', tab}));
  }

  doneCapturing() {
    const {
      replaceCurrentScene,
      addImage,
      clearState,
      resizeAllImages,
      setVideo,
    } = this.props;

    if (this._captureMode === CAPTURE_PICTURE) {
      addImage(this.state.picture)
        .then(() => resizeAllImages())
        .then(clearState)
        .then(() => replaceCurrentScene('PhotoEditScene'));
    } else {
      setVideo(this.state.recordedData)
        .then(clearState)
        .then(() => replaceCurrentScene('VideoEditScene'));
    }
  }

  flipPicture() {
    Animated.sequence([
      Animated.timing(
        this.state.cameraOpacity, {
          toValue: 0.7,
          duration: 350
        }
      ),
      Animated.timing(
        this.state.cameraOpacity, {
          toValue: 1,
          duration: 350
        }
      )
    ]).start();

    const type = toggle(this.state.cameraOptions.type, [
      Camera.constants.Type.front,
      Camera.constants.Type.back
    ]);
    this.setCameraOptions({ type });
  }

  handlePressOut() {
    const { isReviewMode, picture, recordedData } = this.state;
    if (isReviewMode) {
      if (this._captureMode === CAPTURE_PICTURE) {
        return this.props.addImage(picture)
        .then(() => this.setState({ isReviewMode: false }));
      }
      return this.props.setVideo(recordedData)
        .then(() => this.setState({ isReviewMode: false }));
    }

    clearTimeout(this._timer);
    if (this._captureMode === CAPTURE_PICTURE) {
      return this.camera.capture()
      .then(this.capture);
    }

    this.setState({progress: 1});
    return this.camera.stopCapture();
  }

  capture(data) {
    this.props.resizeImage(data, true)
    .then(picture => {
      this.setState({
        picture,
        isReviewMode: true,
      });
    });
  }

  videoCapture(data) {
    this.setState({
      recordedData: {
        uri: data.path,
      },
      isReviewMode: true,
      videoPaused: false,
    });
  }

  onHoldTakePictureButton() {
    if (this.state.isReviewMode) return;
    this._captureMode = CAPTURE_PICTURE;
    this._timer = setTimeout(() => {
      clearTimeout(this._timer);
      // Start record Video
      this._captureMode = CAPTURE_VIDEO;
      this._recordTime = 0;
      this._timer = setInterval(() => this.calcRecordTime(), REC_ANIMATION_DELAY_TIME);
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
        .then(this.videoCapture);
    }, 200);
  }

  toggleFlash() {
    const flashMode = toggle(this.state.cameraOptions.flashMode, [
      Camera.constants.FlashMode.off,
      Camera.constants.FlashMode.auto,
      Camera.constants.FlashMode.on
    ]);
    this.setCameraOptions({ flashMode });
  }

  renderCameraContent(isReviewMode) {
    const { cameraOptions, picture, recordedData, videoPaused } = this.state;
    const flashIcon = cameraOptions.type == Camera.constants.Type.back ?
                      cameraFlashModeIcons[cameraOptions.flashMode] :
                      "";
    if (!isReviewMode) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            captureAudio={false}
            ref={cam => this.camera = cam}
            orientation={Camera.constants.Orientation.auto}
            style={[styles.container, styles.margin0]}
            captureTarget={Camera.constants.CaptureTarget.disk}
            {...cameraOptions}
          />
          <CameraTopBar
            flipIcon="repeat"
            flashIcon={flashIcon}
            cancelIcon="clear"
            cancel={this.props.routeBack}
            toggleFlash={this.toggleFlash}
            flipPicture={this.flipPicture}
          />
        </View>
      );
    }

    if (this._captureMode === CAPTURE_VIDEO) {
      return (
        <View style={styles.cameraContentReview}>
          <TouchableOpacity
            style={styles.cameraContentReview}
            onPress={() => this.setState({ videoPaused: !videoPaused })}
          >
            <Video
              source={{ uri: recordedData.uri }}
              style={styles.cameraContentReview}
              muted={false}
              resizeMode="cover"
              paused={videoPaused}
              repeat={true}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={this.onRetake}>
            <Icon name="clear" style={styles.cancel} />
          </TouchableOpacity>
        </View>
      );
    }
    const width = WINDOW_WIDTH;
    const height = WINDOW_WIDTH * 4 / 3;
    return (
      <View>
        <Image
          source={{ uri: picture.uri }}
          style={[styles.cameraContentReview, { height, width }]}
        />
        <TouchableOpacity style={styles.buttonCancel} onPress={this.onRetake}>
          <Icon name="clear" style={styles.cancel} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      cameraOpacity,
      isReviewMode,
      progress,
    } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.container,
            styles.margin0,
            { opacity: cameraOpacity },
            isReviewMode && { paddingTop: 20 }
          ]}
        >
          {this.renderCameraContent(isReviewMode)}
        </Animated.View>
        <CameraBottomBar
          routeCameraRoll={this.routeCameraRoll}
          isReviewMode={isReviewMode}
          onDone={this.doneCapturing}
          onHoldTakePictureButton={this.onHoldTakePictureButton}
          handlePressOut={this.handlePressOut}
          progress={progress}
        />
      </View>
    );
  }
}
