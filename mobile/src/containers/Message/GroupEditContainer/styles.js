import { StyleSheet } from 'react-native';
import { WHITE, GRAY, RED } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  margin: {
    marginTop: 10,
  },
  bottom: {
    marginTop: 20,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    flex: 1,
  },
  labelLeave: {
    color: GRAY,
    fontSize: 15,
  },
  leaveGroup: {
    width: WINDOW_WIDTH / 3,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: RED,
    borderWidth: 1,
  },
  iconMenuContainer: {
    width: 30,
  },
  iconMenu: {
    width: 20,
    height: 20,
    tintColor: WHITE
  },
});
