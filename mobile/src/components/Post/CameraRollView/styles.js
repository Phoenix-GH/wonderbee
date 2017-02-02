import { StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH / 3,
    height: WINDOW_WIDTH / 3,
    borderWidth: 1,
    borderColor: WHITE
  },
  imageImage: {
    resizeMode: 'cover',
  },
  imageSelected: {
    position: 'absolute',
    width: WINDOW_WIDTH / 3,
    height: WINDOW_WIDTH / 3,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  cameraRoll: {
    height: WINDOW_WIDTH * 4 / 3,
    width: WINDOW_WIDTH,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
