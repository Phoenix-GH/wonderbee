import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: DARK_GRAY,
    fontSize: 8,
    fontFamily: 'ProximaNova-Regular',
  }
});

export function ProfileText({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

ProfileText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
