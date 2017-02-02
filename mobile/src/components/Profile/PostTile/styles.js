import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    margin: 5,
    height: WINDOW_WIDTH / 3 - 10,
    width: WINDOW_WIDTH / 3 - 10
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
