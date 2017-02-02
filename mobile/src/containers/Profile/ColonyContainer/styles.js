import { StyleSheet } from 'react-native';
import { WHITE, RED } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignSelf: 'center',
  },
  iconColonyAdd: {
    height: 25,
    width: 32,
    tintColor: WHITE,
  },
  colony: {
    paddingVertical: 5,
  },
  delete: {
    width: 100,
    flex: 1,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  colonyDeleteText: {
    color: WHITE,
  }
});
