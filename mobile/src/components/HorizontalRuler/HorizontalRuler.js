import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export function HorizontalRuler({ style }) {
  return (
    <View style={[styles.hr, style]} />
  );
}

HorizontalRuler.propTypes = {
  style: View.propTypes.style
};
