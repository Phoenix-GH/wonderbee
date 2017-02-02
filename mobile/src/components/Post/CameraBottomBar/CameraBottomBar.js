import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { styles } from './styles';
import { CameraRecButton } from 'AppComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function CameraBottomBar({
  onHoldTakePictureButton,
  handlePressOut,
  routeCameraRoll,
  isReviewMode,
  onDone,
  progress,
}) {
  return (
    <View style={[styles.container, isReviewMode && { backgroundColor: '#000' }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => routeCameraRoll(isReviewMode)}
      >
        <Image source={require('img/icons/icon_camera_roll.png')} style={styles.iconCameraRoll} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPressIn={onHoldTakePictureButton}
        onPressOut={handlePressOut}
      >
        <CameraRecButton
          progress={progress}
        />
      { isReviewMode &&
        <Icon name="add" style={styles.iconAdd} />
      }
      </TouchableOpacity>
      {isReviewMode ? (
        <TouchableOpacity onPress={onDone} style={styles.button}>
          <LabelText style={styles.textButton} fontSize={20}>Next</LabelText>
        </TouchableOpacity>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

CameraBottomBar.propTypes = {
  routeCameraRoll: PropTypes.func.isRequired,
  onHoldTakePictureButton: PropTypes.func.isRequired,
  handlePressOut: PropTypes.func.isRequired,
  isReviewMode: PropTypes.bool.isRequired,
  onDone: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
};

CameraBottomBar.defaultProps = {
  isReviewMode: false,
  progress: 1.0,
};
