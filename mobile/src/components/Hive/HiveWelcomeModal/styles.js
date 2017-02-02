import { StyleSheet } from 'react-native';
import { YELLOW, WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  logo: {
    alignSelf: 'center',
    width: 40,
    height: 46,
  },
  closeView: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  close: {
    tintColor: WHITE,
  },
  welcome: {
    fontSize: 13,
    color: YELLOW,
    paddingTop: 5,
    paddingBottom: 8,
  },
  text: {
    color: WHITE,
    fontSize: 10,
  },
  marginBottom: {
    marginBottom: 5,
  }
});
