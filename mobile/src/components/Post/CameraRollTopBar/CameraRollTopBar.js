import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { WHITE, YELLOW, LIGHT_GRAY } from 'AppColors';
import {
  CAMERA_ROLL_PHOTOS,
} from 'AppConstants';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000000',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH / 2,
  },
  buttonLeft: {
    borderColor: LIGHT_GRAY,
    borderRightWidth: 0.5,
  },
  buttonRight: {
    borderColor: LIGHT_GRAY,
    borderLeftWidth: 0.5,
  },
  label: {
    color: WHITE,
    fontSize: 20,
  },
  currButton: {
    borderBottomColor: YELLOW,
    borderBottomWidth: 1,
  },
  currLabel: {
    color: YELLOW,
  },
});

export function CameraRollTopBar({ toggleTab, tab }) {
  const photosActived = tab === CAMERA_ROLL_PHOTOS;
  return (
    <View style={styles.row}>
      <TouchableOpacity
        activeOpacity={photosActived ? 1 : 0.2}
        onPress={!photosActived ? toggleTab : ()=>{}}
        style={[styles.button, styles.buttonLeft, photosActived && styles.currButton]}
      >
        <LabelText style={[styles.label, photosActived && styles.currLabel]}>
          Photos
        </LabelText>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={!photosActived ? 1 : 0.2}
        onPress={photosActived ? toggleTab : ()=>{}}
        style={[styles.button, styles.buttonRight, !photosActived && styles.currButton]}
      >
        <LabelText style={[styles.label, !photosActived && styles.currLabel]}>
          Videos
        </LabelText>
      </TouchableOpacity>
    </View>
  );
}

CameraRollTopBar.propTypes = {
  toggleTab: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
};
