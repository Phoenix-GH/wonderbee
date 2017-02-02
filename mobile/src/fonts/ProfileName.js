import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: DARK_GRAY,
    fontSize: 16,
    fontFamily: 'ProximaNova-SemiBold',
  }
});

export function ProfileName({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

ProfileName.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
