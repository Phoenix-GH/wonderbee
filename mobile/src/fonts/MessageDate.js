import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: GRAY,
    fontSize: 9,
    fontFamily: 'ProximaNova-Light',
  }
});

export function MessageDate(props) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

MessageDate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
