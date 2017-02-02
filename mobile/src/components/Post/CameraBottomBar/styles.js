import { StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3,
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconCameraRoll: {
    width: 40,
    height: 33,
    tintColor: WHITE,
  },
  textButton: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 20
  },
  button: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAdd: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 30,
    left: 30,
    fontSize: 40,
    color: WHITE
  },
});
