import React, { Component, PropTypes } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
//import shallowCompare from 'react-addons-shallow-compare';
import {
  CameraRollTopBar,
  CameraRollView,
  PreviewBottomBar,
} from 'AppComponents';
import {
  STATUSBAR_HEIGHT,
  CAMERA_ROLL_PHOTOS,
  CAMERA_ROLL_VIDEOS
} from 'AppConstants';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: -STATUSBAR_HEIGHT,
      },
    }),
    backgroundColor: WHITE
  }
});

export class CameraRollContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    replaceCurrentScene: PropTypes.func.isRequired,
    addImage: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    clearState: PropTypes.func.isRequired,
    resizeAllImages: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
    setVideo: PropTypes.func.isRequired,
    removeVideo: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      tab: props.tab || CAMERA_ROLL_PHOTOS,
    };

    this.routeToPostEdit = ::this.routeToPostEdit;
    this.routeBack = ::this.routeBack;
    this.toggleTab = ::this.toggleTab;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState);
  // }

  componentWillUnmount() {
    this.props.clearState();
  }

  toggleTab() {
    this.setState({
      tab: this.state.tab === CAMERA_ROLL_PHOTOS ? CAMERA_ROLL_VIDEOS : CAMERA_ROLL_PHOTOS,
    });
  }

  routeToPostEdit() {
    const { resizeAllImages, clearState, replaceCurrentScene } = this.props;
    if (this.state.tab === CAMERA_ROLL_PHOTOS) {
      if (this.props.images.length > 0) {
        resizeAllImages()
          .then(clearState)
          .then(() => replaceCurrentScene('PhotoEditScene'));
      }
    } else {
      if (this.props.videos.length > 0) {
        replaceCurrentScene('VideoEditScene');
      }
    }
  }

  routeBack() {
    this.props.routeBack('CameraScene');
  }

  render() {
    const { tab } = this.state;
    const { addImage, removeImage, images, videos, setVideo, removeVideo } = this.props;
    const isPhotos = tab === CAMERA_ROLL_PHOTOS;
    const isVideos = tab === CAMERA_ROLL_VIDEOS;
    return (
      <View style={styles.container}>
        <CameraRollTopBar
          tab={tab}
          toggleTab={this.toggleTab}
        />
        <CameraRollView
          assetType={CAMERA_ROLL_PHOTOS}
          visible={isPhotos}
          images={images}
          addImage={addImage}
          removeImage={removeImage}
        />
        <CameraRollView
          assetType={CAMERA_ROLL_VIDEOS}
          visible={isVideos}
          images={videos}
          addImage={setVideo}
          removeImage={removeVideo}
        />
        <PreviewBottomBar
          images={isPhotos ? images : videos}
          routeScene={this.routeToPostEdit}
          routeBack={this.routeBack}
          removeImage={isPhotos ? removeImage : removeVideo}
        />
      </View>
    );
  }
}
