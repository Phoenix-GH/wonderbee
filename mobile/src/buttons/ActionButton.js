import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AUX_TEXT, YELLOW } from 'AppColors';
import { WINDOW_WIDTH as width, WINDOW_HEIGHT as height } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 3 / 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'transparent',
    width: width * 3 / 4,
    height: height / 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: AUX_TEXT,
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    color: AUX_TEXT
  },
  icon: {
    position: 'absolute',
    left: 15,
  }
});

export function ActionButton({
  isActive,
  showActiveBorder,
  activeColor,
  style,
  label,
  icon,
  labelStyle,
  upperCase,
  onPress,
  onPressIn,
  iconStyle,
}) {
  const buttonLabel = (typeof label === 'string' && upperCase) ? label.toUpperCase() : label;
  const activeBorderStyle = isActive && showActiveBorder ? { borderColor: activeColor } : {};
  const activeLabelStyle = isActive ? { color: activeColor } : {};
  return (
    <TouchableOpacity
      disabled={!isActive}
      onPressIn={() => onPressIn && onPressIn()}
      onPress={() => isActive && onPress()}
      style={[styles.button, activeBorderStyle, style]}
    >
      <View style={styles.container}>
        {icon &&
          <Image source={icon} style={[styles.icon, iconStyle]} />
        }
        { typeof label === 'string' ?
            <Text style={[styles.label, activeLabelStyle, labelStyle]}>{buttonLabel}</Text>
          :
            buttonLabel
        }
      </View>
    </TouchableOpacity>
  );
}


ActionButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  onPressIn: PropTypes.func,
  isActive: PropTypes.bool,
  activeColor: PropTypes.string,
  showActiveBorder: PropTypes.bool,
  style: View.propTypes.style,
  label: PropTypes.any.isRequired,
  icon: PropTypes.any,
  labelStyle: Text.propTypes.style,
  iconStyle: Image.propTypes.style,
  upperCase: PropTypes.bool,
};

ActionButton.defaultProps = {
  isActive: true,
  activeColor: YELLOW,
  upperCase: true,
  showActiveBorder: true
};
