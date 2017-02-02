import { StyleSheet } from 'react-native';
import { WHITE, GREEN, BLUE, BG_DARK_GRAY } from 'AppColors';
import { NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: NAVBAR_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: NAVBAR_HEIGHT,
    width: WINDOW_WIDTH / 5 - 3,
    backgroundColor: 'transparent'
  },
  buttonPost: {
    alignItems: 'center',
    marginTop: 5,
    height: NAVBAR_HEIGHT,
    width: WINDOW_WIDTH / 5 + 12,
    backgroundColor: 'transparent'
  },
  iconNavFeed: {
    width: 27,
    height: 32,
    tintColor: BG_DARK_GRAY,
  },
  iconProfile: {
    width: 27,
    height: 32,
    tintColor: BG_DARK_GRAY,
  },
  iconNavPost: {
    width: 60,
    height: 60,
  },
  iconMessage: {
    width: 40,
    height: 32,
    tintColor: BG_DARK_GRAY,
  },
  iconHive: {
    width: 32,
    height: 32,
    tintColor: BG_DARK_GRAY,
  },
  countContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  count: {
    padding: 3,
    marginTop: 5,
    minWidth: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageCount: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  notificationCount: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  labelCount: {
    color: WHITE,
  }
});
