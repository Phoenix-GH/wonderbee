import React, { PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { WHITE, GRAY, BLUE } from 'AppColors';
import { WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  button: {
    backgroundColor: BLUE,
    height: WINDOW_HEIGHT / 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY,
  },
  label: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Panton-Regular'
  }
});

export function ProfileButton(props) {
  const { style, label, labelStyle, upperCase } = props;
  const buttonLabel = upperCase ? label.toUpperCase() : label;
  return (
    <TouchableHighlight
      {...props}
      style={[styles.button, style]}
    >
      <Text style={[styles.label, labelStyle]}>{buttonLabel}</Text>
    </TouchableHighlight>
  );
}

ProfileButton.propTypes = {
  underlayColor: PropTypes.string,
  style: View.propTypes.style,
  label: PropTypes.string.isRequired,
  labelStyle: Text.propTypes.style,
  upperCase: PropTypes.bool,
};

ProfileButton.defaultProps = {
  underlayColor: BLUE,
  upperCase: true,
};
