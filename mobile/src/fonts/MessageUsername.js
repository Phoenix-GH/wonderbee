import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GREEN } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: GREEN,
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
  }
});

export function MessageUsername(props) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

MessageUsername.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
