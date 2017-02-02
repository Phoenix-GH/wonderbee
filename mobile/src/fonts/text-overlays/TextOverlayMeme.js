import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { WHITE, BLACK } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontSize: 36,
    fontFamily: 'ProximaNova-Black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: BLACK,
    alignSelf: 'flex-start',
  }
});

export function TextOverlayMeme({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

TextOverlayMeme.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
