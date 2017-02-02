import { StyleSheet } from 'react-native';
import { WHITE, BORDER_LIGHT_GRAY, BG_LIGHT_GRAY, BLACK, LIGHT_GRAY, GREEN, GRAY, BLUE } from 'AppColors';
import { WINDOW_WIDTH, NAVBAR_HEIGHT } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionFacebook: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebook: {
    backgroundColor: BLUE,
  },
  actionButtons: {
    backgroundColor: GREEN,
    borderColor: BG_LIGHT_GRAY,
    marginBottom: 10,
    width: WINDOW_WIDTH,
  },
  input: {
    flex: 1,
    height: 30
  },
  actionButtonLabel: {
    color: WHITE,
  },
  connectFacebook: {
    marginLeft: 5,
    color: WHITE,
  },
  top: {
    flex: 0,
    height: NAVBAR_HEIGHT,
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    borderTopWidth: 3,
    paddingTop: 2,
    backgroundColor: WHITE,
    borderColor: LIGHT_GRAY,
  },
  titleLabel: {
    color: WHITE,
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  left: {
    marginLeft: 25,
  },
  right: {
    marginRight: 25,
  },
  centerButton: {
    height: NAVBAR_HEIGHT / 2,
    borderRadius: NAVBAR_HEIGHT / 4,
    backgroundColor: GREEN,
    width: WINDOW_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteText: {
    color: WHITE,
  },
  grayText: {
    color: GRAY,
  },
  bold: {
    fontWeight: 'bold',
  },
});
