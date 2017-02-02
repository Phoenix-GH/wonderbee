import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
  },
  surface: {
    marginBottom: 10,
  },
  filter: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  }
});
