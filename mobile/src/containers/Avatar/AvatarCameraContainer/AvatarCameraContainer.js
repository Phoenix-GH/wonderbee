import React, { Component, PropTypes } from 'react';
import {
  View,
  Animated,
  Image,
  LayoutAnimation,
  NativeModules,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SimpleViewEditor } from 'react-native-view-editor';
import RNViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Camera from 'react-native-camera';
import { AvatarCameraControls } from 'AppComponents';
import {
  CAPTURE_PICTURE,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  REC_ANIMATION_DELAY_TIME,
  REC_ANIMATION_LIMIT_TIME,
  REC_PATH_AMOUNT,
} from 'AppConstants';
import { toggle } from 'AppUtilities';
import { connectFeathers } from 'AppConnectors';
import { WHITE, BLACK } from 'AppColors';

const CameraManager = NativeModules.CameraManager || NativeModules.CameraModule;

const cameraFlashModeIcons = {
  [Camera.constants.FlashMode.off]: 'flash-off',
  [Camera.constants.FlashMode.auto]: 'flash-auto',
  [Camera.constants.FlashMode.on]: 'flash-on',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  image: {
    position: 'absolute',
    top: 60,
    left: 0,
    height: WINDOW_WIDTH,
    width: WINDOW_WIDTH,
    opacity: 0.7,
  },
  icon: {
    fontSize: 30,
    color: WHITE
  },
  top: {
    height: 30,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: BLACK,
    opacity: 0.5,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingTop: 20,
    paddingLeft: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
  },
  cameraContentReview: {
    flex: 1,
  },
});

export class AvatarCameraContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    onAvatarSave: PropTypes.func,
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
      imageSelectedFromCamera: false,
      maskVisible: true,
      onAvatarSave: PropTypes.func,
    };
    this.setCameraOptions = ::this.setCameraOptions;
    this.flipPicture = ::this.flipPicture;
    this.toggleFlash = ::this.toggleFlash;
    this.handlePress = ::this.handlePress;
    this.capture = ::this.capture;
    this.onRetake = ::this.onRetake;
    this.doneCapturing = ::this.doneCapturing;
    this.takeSnapShot = ::this.takeSnapShot;
    this.routeCameraRoll = ::this.routeCameraRoll;
    this.onImageFromCameraRoll = ::this.onImageFromCameraRoll;
    this.routeBack = ::this.routeBack;
    this.save = ::this.save;
    this.camera = null;
    this._captureMode = CAPTURE_PICTURE;
    this._pathLength = 0;
  }

  componentDidMount() {
    // THIS IS A HACK TO MAKE RESET CAMERA FLASH SETTING TO AUTO
    StatusBar.setHidden(true);
    this.setCameraOptions({
      flashMode: Camera.constants.FlashMode.auto
    });
    // calc path length
    const _pathTimeFrame = REC_ANIMATION_LIMIT_TIME * 1000 / REC_PATH_AMOUNT;
    this._pathLength = _pathTimeFrame / REC_ANIMATION_DELAY_TIME;
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
  }

  onImageFromCameraRoll(image, cb = () => {}) {
    this.setState({
      isReviewMode: true,
      picture: image,
      imageSelectedFromCamera: true
    }, cb);
  }

  onRetake() {
    this._captureMode = CAPTURE_PICTURE;
    LayoutAnimation.spring();
    this.setState({ isReviewMode: false, imageSelectedFromCamera: false });
  }

  setCameraOptions(options) {
    this.setState({
      cameraOptions: {
        ...this.state.cameraOptions,
        ...options
      }
    });
  }

  routeCameraRoll() {
    const { routeScene } = this.props;
    return routeScene('AvatarCameraRollScene', { imageSelected: this.onImageFromCameraRoll });
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

  handlePress() {
    return this.camera.capture()
      .then(this.capture);
  }

  capture(picture) {
    this.setState({
      picture: { uri: picture.path },
      isReviewMode: true,
    });
  }

  toggleFlash() {
    const flashMode = toggle(this.state.cameraOptions.flashMode, [
      Camera.constants.FlashMode.off,
      Camera.constants.FlashMode.auto,
      Camera.constants.FlashMode.on
    ]);
    this.setCameraOptions({ flashMode });
  }

  takeSnapShot() {
    return new Promise(resolve => {
      this.setState({ maskVisible: false }, () => {
        resolve(RNViewShot.takeSnapshot(this.imageWrap, {
          format: 'jpg',
          quality: 0.9,
          result: 'data-uri',
          width: WINDOW_WIDTH,
          height: WINDOW_WIDTH,
        }));
      });
    });
  }

  save() {
    if (this.props.onAvatarSave) {
      this.props.onAvatarSave(this.state.picture);
    }
    return this.routeBack();
  }

  doneCapturing() {
    this.takeSnapShot()
      .then(image => this.state.picture = image)
      .then(() => this.save());
  }

  routeBack() {
    const { routeBack } = this.props;
    this.setState({ uploading: false });
    routeBack();
  }

  renderCameraContent(isReviewMode) {
    const { cameraOptions, picture, maskVisible } = this.state;
    if (!isReviewMode) {
      return (
        <View style={styles.cameraContentReview}>
          <Camera
            captureAudio={false}
            ref={cam => this.camera = cam}
            orientation={Camera.constants.Orientation.portrait}
            style={[styles.container, styles.margin0]}
            captureTarget={Camera.constants.CaptureTarget.disk}
            {...cameraOptions}
          >
            <View />
          </Camera>
          <View style={[styles.top, { height: 60 }]} />
          <TouchableOpacity onPress={this.routeBack} style={styles.button} >
            <Icon name="clear" style={styles.icon} />
          </TouchableOpacity>
        </View>
      );
    }
    const width = WINDOW_WIDTH;
    const height = WINDOW_HEIGHT;
    return (
      <View style={[styles.container, styles.margin0]} >
        <View
          style={[styles.image, { backgroundColor: 'rgba(0, 0, 0, 0)', top: 100, opacity: 1 }]}
          ref={ref => this.imageWrap = ref}
        >
          <SimpleViewEditor
            imageWidth={width}
            imageHeight={height}
            style={{ top: -100 }}
            imageMask={maskVisible && (
              <View style={styles.image} >
                <Image
                  source={require('img/images/profile_mask_square.png')}
                  style={[styles.image, { top: 0 }]}
                />
              </View>
            )}
          >
            <Image
              style={styles.cameraContentReview}
              source={{ uri: picture.uri }}
            />
          </SimpleViewEditor>
        </View>
        <View style={[styles.top, { height: 60 }]} />
        <TouchableOpacity onPress={this.routeBack} style={styles.button} >
          <Icon name="clear" style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      cameraOpacity,
      isReviewMode,
      cameraOptions,
      imageSelectedFromCamera,
    } = this.state;
    const flashIcon = cameraFlashModeIcons[cameraOptions.flashMode];
    const takePicIcon = require('img/images/take_pic.png');
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, styles.margin0, { opacity: cameraOpacity }]}>
          {this.renderCameraContent(isReviewMode)}
        </Animated.View>
        {!isReviewMode && (
          <View style={styles.image} >
            <Image
              source={require('img/images/profile_mask_square.png')}
              style={[styles.image, { top: 0 }]}
            />
          </View>
        )}
        <AvatarCameraControls
          routeCameraRoll={this.routeCameraRoll}
          cameraIcon={takePicIcon}
          isReviewMode={isReviewMode}
          imageSelectedFromCamera={imageSelectedFromCamera}
          isPhotoMode={true}
          flipIcon="repeat"
          flipPicture={this.flipPicture}
          flashIcon={flashIcon}
          toggleFlash={this.toggleFlash}
          onDone={this.doneCapturing}
          onCapture={this.handlePress}
          onRetake={this.onRetake}
        />
      </View>
    );
  }
}

export default connectFeathers(AvatarCameraContainer);
