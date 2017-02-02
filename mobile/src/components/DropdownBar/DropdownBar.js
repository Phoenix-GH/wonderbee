import React, { PropTypes } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { WHITE, YELLOW, GRAY } from 'AppColors';
import { TextBold } from 'AppFonts';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -30,
    left: 0,
    width: WINDOW_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  row: {
    width: WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
  },
  labelText: {
    fontSize: 11,
    color: WHITE,
  },
  text: {
    fontSize: 12,
    color: YELLOW,
  },
});

export function DropdownBar({
  scaleY,
  translateY,
  setSortBy,
  sortButtons,
  topLabel
}) {
  const containerHeight = !!topLabel ?
    WINDOW_HEIGHT / 4 : WINDOW_HEIGHT / 3;
  return (
    <Animated.View
      style={[styles.container, {
        height: containerHeight,
        transform: [
          { scaleY },
          { translateY },
        ],
      }]}
    >
      {topLabel && (
        <View
          style={[
            styles.row, styles.topRow,
            { height: containerHeight / (sortButtons.length + 1) }
          ]}
        >
          <TextBold style={styles.labelText}>
            {topLabel}
          </TextBold>
        </View>
      )}
      {sortButtons.map((btn, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.row, { height: containerHeight / (sortButtons.length + 1) }]}
          onPress={() => setSortBy(btn.type)}
        >
          <TextBold style={styles.text}>
            {btn.label}
          </TextBold>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

DropdownBar.propTypes = {
  setSortBy: PropTypes.func.isRequired,
  scaleY: PropTypes.object.isRequired,
  translateY: PropTypes.object.isRequired,
  sortButtons: PropTypes.array.isRequired,
  topLabel: PropTypes.string,
};
