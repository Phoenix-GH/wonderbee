import React, { Component } from 'react';
import { Animated } from 'react-native';
import Camera from 'react-native-camera';
import { toggle } from 'AppUtilities';
import { styles } from './styles';

export default class CameraComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cameraOptions: {
        type: Camera.constants.Type.back,
        flashMode: Camera.constants.FlashMode.off,
        flashIcon: 'auto',
      },
      cameraOpacity: new Animated.Value(1),
    };
    this.getCamera = ::this.getCamera;
    this.setCameraOptions = ::this.setCameraOptions;
    this.flipPicture = ::this.flipPicture;
    this.toggleFlash = ::this.toggleFlash;
    this.camera = null;
  }

  componentDidMount() {
    // THIS IS A HACK TO MAKE RESET CAMERA FLASH SETTING TO AUTO
    this.setCameraOptions({
      flashMode: Camera.constants.FlashMode.auto
    });
  }

  setCameraOptions(options) {
    this.setState({
      cameraOptions: {
        ...this.state.cameraOptions,
        ...options
      }
    });
  }

  getCamera() {
    return this.camera;
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

  toggleFlash() {
    const flashMode = toggle(this.state.cameraOptions.flashMode, [
      Camera.constants.FlashMode.off,
      Camera.constants.FlashMode.auto,
      Camera.constants.FlashMode.on
    ]);
    const flashIcon = toggle(this.state.cameraOptions.flashIcon, ['off', 'auto', 'on']);
    this.setCameraOptions({ flashMode, flashIcon });
    return flashIcon;
  }

  render() {
    const { cameraOpacity, cameraOptions } = this.state;
    return (
      <Animated.View style={[styles.container, { opacity: cameraOpacity }]}>
        <Camera
          ref={cam => this.camera = cam}
          orientation={Camera.constants.Orientation.portrait}
          style={styles.container}
          captureTarget={Camera.constants.CaptureTarget.disk}
          {...cameraOptions}
        />
      </Animated.View>
    );
  }
}
