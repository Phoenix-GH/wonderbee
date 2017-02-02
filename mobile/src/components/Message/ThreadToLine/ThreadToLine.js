import React, { PropTypes } from 'react';
import { View, Image, TextInput } from 'react-native';
import { styles } from './styles';

export const ThreadToLine = ({ onChangeText, inputValue }) => (
  <View style={styles.container}>
    <TextInput onChangeText={onChangeText} style={styles.input} value={inputValue} />
    <View style={styles.iconContainer}>
      <Image source={require('img/icons/icon_add_new.png')} style={styles.iconAdd} />
    </View>
  </View>
);

ThreadToLine.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};
