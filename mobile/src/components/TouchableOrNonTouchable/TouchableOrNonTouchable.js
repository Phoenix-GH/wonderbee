import React, { PropTypes } from 'react';
import { View, TouchableOpacity } from 'react-native';

export function TouchableOrNonTouchable(props) {
  if (props.onPress) {
    return <TouchableOpacity {...props} />;
  }
  return <View {...props} />;
}

TouchableOrNonTouchable.propTypes = {
  onPress: PropTypes.func,
};
