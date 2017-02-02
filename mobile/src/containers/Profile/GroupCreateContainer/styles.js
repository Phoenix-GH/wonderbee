import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    width: WINDOW_WIDTH / 2,
    padding: 10,
    marginTop: 10,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  center: {
    alignSelf: 'center',
  }
});
