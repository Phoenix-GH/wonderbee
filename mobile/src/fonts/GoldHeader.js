import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { YELLOW } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: YELLOW,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Panton-Semibold',
  }
});

export function GoldHeader({ children, style }) {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  );
}

GoldHeader.propTypes = {
  children: PropTypes.string.isRequired,
  style: Text.propTypes.style,
};
