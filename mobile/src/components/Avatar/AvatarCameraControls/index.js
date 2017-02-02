import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LabelText } from 'AppFonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WHITE, BLACK } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT, STATUSBAR_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT - WINDOW_WIDTH - 40 - STATUSBAR_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: BLACK,
    opacity: 0.5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconCameraRoll: {
    width: 40,
    height: 33,
    tintColor: WHITE,
  },
  iconCamera: {
    width: 60,
    height: 60,
  },
  textButton: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textSaveButton: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 20,
  },
  saveButton: {
    width: WINDOW_WIDTH / 2,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  button: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  icon: {
    fontSize: 30,
    color: WHITE,
  },
  transparent: {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
});

export function AvatarCameraControls({
  onCapture,
  routeCameraRoll,
  isReviewMode,
  imageSelectedFromCamera,
  onRetake,
  onDone,
  flashIcon,
  toggleFlash,
  flipPicture,
  flipIcon,
}) {
  if (isReviewMode) {
    if (imageSelectedFromCamera) {
      return (
        <View style={[styles.container, styles.transparent]} >
          <View style={styles.container} />
          <View >
            <TouchableOpacity onPress={onDone} style={styles.saveButton}>
              <LabelText style={styles.textSaveButton} fontSize={20}>Save</LabelText>
            </TouchableOpacity>
          </View>
          <View style={[{ flexDirection: 'row', marginBottom: 20 }]}>
            <View >
              <TouchableOpacity
                style={styles.button}
                onPress={() => routeCameraRoll(isReviewMode)}
              >
                <Image
                  source={require('img/icons/icon_camera_roll.png')}
                  style={styles.iconCameraRoll}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={onRetake} >
              <Image source={require('img/icons/icon_camera.png')} style={styles.iconCameraRoll} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.container, styles.transparent]} >
        <View style={styles.container} />
        <TouchableOpacity onPress={onDone} style={styles.saveButton}>
          <LabelText style={styles.textSaveButton} fontSize={20}>Save</LabelText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRetake} style={styles.button}>
          <LabelText style={styles.textButton} fontSize={20}>Retake</LabelText>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={[styles.container, styles.transparent]} >
      <View style={styles.container} />
      <View style={[{ flexDirection: 'row', marginBottom: 10 }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => routeCameraRoll(isReviewMode)}
        >
          <Image source={require('img/icons/icon_camera_roll.png')} style={styles.iconCameraRoll} />
        </TouchableOpacity>
        <TouchableOpacity onPress={flipPicture} style={styles.button}>
          <Icon name={flipIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFlash} style={styles.button}>
          <Icon name={flashIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View >
      <TouchableOpacity
        style={[styles.button, { marginBottom: 20 }]}
        onPress={onCapture}
      >
        <Image
          source={require('img/icons/icon_camera_capture.png')}
          style={styles.iconCamera} resizeMode={'contain'}
        />
      </TouchableOpacity>
      </View>
    </View>
  );
}

AvatarCameraControls.propTypes = {
  routeCameraRoll: PropTypes.func.isRequired,
  onCapture: PropTypes.func.isRequired,
  isReviewMode: PropTypes.bool.isRequired,
  imageSelectedFromCamera: PropTypes.bool.isRequired,
  onDone: PropTypes.func.isRequired,
  onRetake: PropTypes.func.isRequired,
  flashIcon: PropTypes.string.isRequired,
  toggleFlash: PropTypes.func.isRequired,
  flipIcon: PropTypes.string.isRequired,
  flipPicture: PropTypes.func.isRequired,
};

AvatarCameraControls.defaultProps = {
  isReviewMode: false,
  imageSelectedFromCamera: false,
};
