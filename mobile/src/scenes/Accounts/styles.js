import { StyleSheet } from 'react-native';
import { BG_DARK_GRAY } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK_GRAY,
  },
  flex: {
    flex: 1,
    flexDirection: 'row'
  },
  splashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});
