import { StyleSheet } from 'react-native';
import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  STATUSBAR_HEIGHT,
  NAVBAR_HEIGHT,
} from 'AppConstants';
import { YELLOW } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - STATUSBAR_HEIGHT - NAVBAR_HEIGHT,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: STATUSBAR_HEIGHT + NAVBAR_HEIGHT,
  },
  title: {
    color: YELLOW,
    fontFamily: 'Panton-Semibold',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: YELLOW,
    fontFamily: 'Panton-Semibold',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  viewButton: {
    color: YELLOW,
    fontFamily: 'Panton-Semibold',
    fontWeight: 'bold',
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 40,
  }
});
