import { StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  simpleRow: {
    flexDirection: 'row',
  },
  image: {
    tintColor: WHITE,
    height: 30,
  },
  leftButton: {
    borderRightWidth: 1,
    borderColor: WHITE,
  },
  rightButton: {
    borderLeftWidth: 1,
    borderColor: WHITE,
  },
});
