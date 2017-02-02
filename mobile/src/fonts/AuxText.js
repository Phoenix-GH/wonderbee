import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { AUX_TEXT } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: AUX_TEXT,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
  }
});

export function AuxText(props) {
  const { children, style, upperCase } = props;
  const label = (typeof children === 'string' && upperCase) ? children.toUpperCase() : children;
  return (
    <Text {...props} style={[styles.text, style]}>
      {label}
    </Text>
  );
}

AuxText.propTypes = {
  children: PropTypes.any.isRequired,
  style: Text.propTypes.style,
  upperCase: PropTypes.bool,
};

AuxText.defaultProps = {
  upperCase: true,
};
