import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export const Notification = ({ content, handlePress }) => (
  <TouchableOpacity onPress={handlePress}>
    <View style={styles.row}>
      <Text style={styles.content}>
        {content}
      </Text>
    </View>
  </TouchableOpacity>
);

Notification.propTypes = {
  content: PropTypes.string.isRequired,
  handlePress: PropTypes.func.isRequired,
};
