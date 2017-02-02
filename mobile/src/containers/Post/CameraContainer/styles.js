import { StyleSheet, Platform } from 'react-native';
import { GRAY, BG_LIGHT_GRAY, WHITE } from 'AppColors';
import { WINDOW_WIDTH as width, WINDOW_HEIGHT as height, STATUSBAR_HEIGHT } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: -STATUSBAR_HEIGHT,
      },
    }),
  },
  gray: {
    height: height / 12,
    backgroundColor: GRAY,
    width,
  },
  bigGray: {
    height: height / 6,
  },
  button: {
    backgroundColor: BG_LIGHT_GRAY,
    height: height / 15,
  },
  label: {
    color: GRAY,
  },
  cameraContentReview: {
    flex: 1
  },
  videoPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  coverArea: {
    flex: 1
  },
  coverContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  margin0: {
    marginTop: 0,
  },
  cancel: {
    backgroundColor:'transparent',
    fontSize: 30,
    color: WHITE,
  },
  buttonCancel: {
    position: 'absolute',
    top: 15,
    left: 30,
  }
});
