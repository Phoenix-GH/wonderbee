/**
 * Created by nick on 21/07/16.
 */
import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY, WHITE } from 'AppColors';
import { NAVBAR_HEIGHT } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,10,0.6)'
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: WHITE
  },
  imageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    padding: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    height: 30,
    borderRadius: 5,
    borderColor: GRAY,
    borderWidth: 1,
    backgroundColor: GRAY,
    color: WHITE,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
  },
});
