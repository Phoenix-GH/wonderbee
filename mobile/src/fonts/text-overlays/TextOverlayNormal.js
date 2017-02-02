import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontSize: 36,
    fontFamily: 'ProximaNova-Regular',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  }
});

export function TextOverlayNormal({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

TextOverlayNormal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
