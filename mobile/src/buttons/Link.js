import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AUX_TEXT } from 'AppColors';

const styles = StyleSheet.create({
  button: {
    borderColor: 'lime',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: AUX_TEXT,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Panton-Regular'
  }
});

export function Link(props) {
  const { style, label, labelStyle, upperCase } = props;
  const buttonLabel = upperCase ? label.toUpperCase() : label;
  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, style]}
    >
      <Text style={[styles.label, labelStyle]}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
}

Link.propTypes = {
  style: View.propTypes.style,
  label: PropTypes.string.isRequired,
  labelStyle: Text.propTypes.style,
  upperCase: PropTypes.bool,
};

Link.defaultProps = {
  upperCase: true,
};
