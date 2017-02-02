import { StyleSheet } from 'react-native';
import { STATUSBAR_HEIGHT } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'space-between'
  },
  bold: {
    fontWeight: 'bold'
  },
  button: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBack: {
    height: 20,
    width: 12
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  blurViewAndroid: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 50
  },
  rightLabel: {
    backgroundColor: 'transparent',
  }
});
