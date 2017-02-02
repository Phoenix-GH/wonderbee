import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GrayHeader } from 'AppFonts';
import { SECONDARY_TEXT } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    color: SECONDARY_TEXT,
    marginBottom: 10,
  }
});

export function EmptyFeedHeader(style) {
  return (
    <View style={[styles.container, style && style.style]}>
      <GrayHeader style={styles.text}>
        You're Feed is Empty.
      </GrayHeader>
      <GrayHeader style={styles.text}>
        Why not follow some people?
      </GrayHeader>
    </View>
  );
}

EmptyFeedHeader.propTypes = {
  style: View.propTypes.style,
};
