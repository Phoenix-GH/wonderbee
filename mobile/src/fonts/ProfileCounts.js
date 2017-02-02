import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: DARK_GRAY,
    fontSize: 18,
    fontFamily: 'ProximaNova-Semibold',
  }
});

export function ProfileCounts({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

ProfileCounts.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
