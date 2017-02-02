import React, { PropTypes } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';

export function TextInputWithAddons({ leftAddon, rightAddon, style, ...props }) {
  return (
    <View style={styles.container}>
      {leftAddon && (
        <View style={styles.leftAddon}>
          {leftAddon}
        </View>
      )}
      <TextInput {...props} style={[styles.input, style]} />
      {rightAddon && (
        <View style={styles.rightAddon}>
          {rightAddon}
        </View>
      )}
    </View>
  );
}

TextInputWithAddons.propTypes = {
  leftAddon: PropTypes.node,
  rightAddon: PropTypes.node,
  style: TextInput.propTypes.style,
};
