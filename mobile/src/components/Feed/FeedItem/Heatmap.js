import React, { PropTypes } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  whiteCircle: {
    position: 'absolute'
  }
});

export function Heatmap({ heatmap, width, height, scale, left, userHeatmapVote }) {
  return (
    <Animated.View
      style={[
        styles.container,
        { left, transform: [{ scale }] },
      ]}
    >
      <Image source={{ uri: heatmap }} style={{ width, height }} />
      {userHeatmapVote && (
        <View
          style={[
            styles.whiteCircle,
            { left: userHeatmapVote.x - 20, top: userHeatmapVote.y - 20 }
          ]}
        >
          <Progress.Circle color={WHITE} progress={1} borderWidth={0} />
        </View>
      )}
    </Animated.View>
  );
}

Heatmap.propTypes = {
  heatmap: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.object.isRequired,
  left: PropTypes.object.isRequired,
  userHeatmapVote: PropTypes.object,
};
