import React, { PropTypes } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export function CameraTopBar({
  flipIcon,
  cancelIcon,
  flipPicture,
  flashIcon,
  toggleFlash,
  cancel
}) {
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={cancel}>
          <Icon name={cancelIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.actionRightButtons}>
      { flashIcon != "" &&
        <TouchableOpacity onPress={toggleFlash}>
          <Icon name={flashIcon} style={styles.icon} />
        </TouchableOpacity>
      }
        <TouchableOpacity onPress={flipPicture} style={styles.marginLeft}>
          <Icon name={flipIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

CameraTopBar.propTypes = {
  flipIcon: PropTypes.string.isRequired,
  cancelIcon: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  flipPicture: PropTypes.func.isRequired,
  flashIcon: PropTypes.string.isRequired,
  toggleFlash: PropTypes.func.isRequired,
};
