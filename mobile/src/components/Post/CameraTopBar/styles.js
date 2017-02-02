import { StyleSheet } from 'react-native';
import { GRAY, WHITE } from 'AppColors';
import { WINDOW_HEIGHT as height, WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    height: height / 12,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top: 20,
    left: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 30,
    color: WHITE
  },
  actionRightButtons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  marginLeft: {
    marginLeft: 10
  }
});
