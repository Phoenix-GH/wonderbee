import React, { PropTypes } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export function SettingList({ style, children }) {
  return (
    <ScrollView style={[styles.container, style]}>
      {children}
    </ScrollView>
  );
}

SettingList.propTypes = {
  style: View.propTypes.style,
  children: PropTypes.any,
};
