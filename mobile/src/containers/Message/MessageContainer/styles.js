import { StyleSheet } from 'react-native';
import { BG_LIGHT_GRAY, WHITE } from 'AppColors';
import { NAVBAR_HEIGHT } from 'AppConstants';
export const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: WHITE
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  iconMessagePlaceholder: {
    width: 16,
    height: 13,
  },
  keyboardButtonWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: NAVBAR_HEIGHT + 10,
    right: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardButton: {
    height: 21,
    width: 30,
    tintColor: WHITE,
  },
  navbarSpacing: {
    height: NAVBAR_HEIGHT,
  },
  rightLabel: {
    width: 30
  },
  iconMenuContainer: {
    width: 30,
  },
  iconMenu: {
    width: 29,
    height: 7,
    tintColor: WHITE
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    position: 'absolute',
    top: NAVBAR_HEIGHT / 3 * 2,
    paddingHorizontal: 10,
    right: 20,
    height: 60,
    backgroundColor: BG_LIGHT_GRAY
  },
  menuItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
});
