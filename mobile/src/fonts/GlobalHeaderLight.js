import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontSize: 13,
    fontFamily: 'ProximaNova-Semibold',
  }
});

export function LabelText(props) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

LabelText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
