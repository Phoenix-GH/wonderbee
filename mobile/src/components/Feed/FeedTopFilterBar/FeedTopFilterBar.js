import React, { PropTypes } from 'react';
import { View, Image, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { TextRegular } from 'AppFonts';
import { WINDOW_WIDTH, STATUSBAR_HEIGHT } from 'AppConstants';
import { GRAY, BLACK } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (WINDOW_WIDTH - 40) / 3,
    height: 40,
  },
  icon: {
    height: 30,
    resizeMode: 'contain'
  },
  label: {
    color: GRAY,
  },
  active: {
    color: BLACK,
  }
});

const buttons = [
  { label: 'Following', icon: require('img/icons/feed-settings/following.png') },
  { label: 'Featured', icon: require('img/icons/feed-settings/featured.png') },
  { label: 'Near Me', icon: require('img/icons/feed-settings/nearme.png') },
];

export function FeedTopFilterBar({ translateY, activeFilter }) {
  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {buttons.map((btn, i) => (
        <TouchableOpacity key={i} style={styles.button}>
          <Image source={btn.icon} style={styles.icon} />
          <TextRegular style={[styles.label, activeFilter === btn.label && styles.active]}>
            {btn.label}
          </TextRegular>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

FeedTopFilterBar.propTypes = {
  translateY: PropTypes.object.isRequired,
  activeFilter: PropTypes.string.isRequired,
};
