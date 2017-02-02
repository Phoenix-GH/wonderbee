import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GRAY, WHITE } from 'AppColors';

import { WINDOW_HEIGHT as height } from 'AppConstants';

const styles = StyleSheet.create({
  button: {
    backgroundColor: GRAY,
    flex: 1,
    height: height / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: WHITE,
    fontSize: 20,
    fontFamily: 'Panton-Semibold'
  }
});

export function FlexButton({ style, label, labelStyle, upperCase, onPress }) {
  const buttonLabel = typeof label === 'string' && upperCase ? label.toUpperCase() : label;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
    >
      {typeof label === 'string' ?
        <Text style={[styles.label, labelStyle]}>{buttonLabel}</Text>
      :
        label
      }
    </TouchableOpacity>
  );
}

FlexButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: View.propTypes.style,
  label: PropTypes.any.isRequired,
  labelStyle: Text.propTypes.style,
  upperCase: PropTypes.bool,
};

FlexButton.defaultProps = {
  upperCase: true,
};
