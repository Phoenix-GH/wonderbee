import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontSize: 11,
    fontFamily: 'ProximaNova-Light',
  }
});

export function FeedCountsLight(props) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

FeedCountsLight.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
