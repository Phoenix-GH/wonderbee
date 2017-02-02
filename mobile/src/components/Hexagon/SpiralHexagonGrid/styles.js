import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT, STATUSBAR_HEIGHT } from 'AppConstants';

export const styles = StyleSheet.create({
  scrollView: {
    position: 'absolute',
    height: WINDOW_HEIGHT - STATUSBAR_HEIGHT,
    width: WINDOW_WIDTH,
    top: STATUSBAR_HEIGHT,
    left: 0,
  },
});
