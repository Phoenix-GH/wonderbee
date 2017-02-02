import React, { PropTypes } from 'react';
import { View, Text, ColorPropType, StyleSheet } from 'react-native';

export function Badge({
  size,
  number,
  color,
  style,
  textStyle,
}) {
  const styles = StyleSheet.create({
    view: {
      width: size,
      height: size,
      borderRadius: size,
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: size / 2,
      color: '#FFF',
    },
  });

  return (<View style={[style, styles.view]}>
      <Text style={[styles.text, textStyle]}>{number}</Text>
    </View>);
}

Badge.propTypes = {
  size: PropTypes.number.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: ColorPropType.isRequired,
  style: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
