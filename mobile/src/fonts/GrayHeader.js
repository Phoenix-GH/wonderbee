import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: GRAY,
    fontSize: 20,
    fontFamily: 'Panton-Semibold',
  }
});

export function GrayHeader({ children, style }) {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  );
}

GrayHeader.propTypes = {
  children: PropTypes.any.isRequired,
  style: Text.propTypes.style,
};
