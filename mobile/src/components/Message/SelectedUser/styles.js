import { StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

export const styles = StyleSheet.create({
  userButton: {
    height: 20,
    backgroundColor: 'cadetblue',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  close: {
    tintColor: DARK_GRAY,
    height: 10,
    width: 10,
  }
});
