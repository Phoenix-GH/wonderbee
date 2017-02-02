import { StyleSheet, Platform } from 'react-native';
import { WHITE, GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT, STATUSBAR_HEIGHT } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: -STATUSBAR_HEIGHT,
      },
    }),
    alignItems: 'center',
    backgroundColor: WHITE,
  },

  videoContentReview: {
    flex: 1,
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 4 / 3,
  },

  toolbar: {
    justifyContent: 'space-around',
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
  },

  toolbarOptions: {
    width: WINDOW_WIDTH * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  toolbarButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolbarIcon: {
    height: 70,
    width: 70,
    tintColor: GRAY,
    marginBottom: 10,
  },

  toolbarSlider: {
    width: WINDOW_WIDTH * 0.8,
  },


  navbar: {
    height: 50,
    flexDirection: 'row',
  },

  navButton: {
    height: 50,
    width: WINDOW_WIDTH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  renderLoading: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000'
  }

});
