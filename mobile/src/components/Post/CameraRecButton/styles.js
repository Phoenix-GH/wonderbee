import { StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';
import { WINDOW_WIDTH as width, WINDOW_HEIGHT as height } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100
  },
  takeBorder: {
    flex: 1
  },
  takePicture: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 0,
    top: 0
  },
  takeBorderSvg: {
    flex: 1
  },
});
