import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    height: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleBackground: {
    backgroundColor: '#111',
    opacity: 0.8
  },
  title: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Panton-Semibold',
    marginHorizontal: 10
  }
});

export function ItemImageTitle({ children, style }) {
  return (
    <View>
      <View style={[styles.titleContainer, styles.titleBackground]} />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, style]} numberOfLines={1}>{children}</Text>
      </View>
    </View>
  );
}

ItemImageTitle.propTypes = {
  children: PropTypes.string.isRequired,
  style: Text.propTypes.style,
};
