import { StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  infoText: {
    color: DARK_GRAY,
    fontSize: 10,
  },
  infoNumber: {
    color: DARK_GRAY,
    fontSize: 16,
    paddingLeft: 2,
  },
  listViewContainer: {
    flex: 1,
    paddingTop: 20,
  },
  userContainer: {
    flex: 1,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  username: {
    textAlign: 'center',
    fontSize: 13
  },
});
