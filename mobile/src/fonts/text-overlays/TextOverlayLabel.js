import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontSize: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignSelf: 'flex-start',
  }
});

export function TextOverlayLabel({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

TextOverlayLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
