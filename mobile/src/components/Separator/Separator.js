import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const Separator = ({ style, height }) => (
  <View style={[styles.container, style]}>
    <View style={[styles.separator, { height }]} />
  </View>
);

Separator.propTypes = {
  style: View.propTypes.style,
  height: PropTypes.number
};

Separator.defaultProps = {
  height: 2
};
