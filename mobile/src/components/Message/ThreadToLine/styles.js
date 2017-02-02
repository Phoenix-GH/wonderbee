import { StyleSheet } from 'react-native';
import { LIGHT_TEXT, WHITE } from 'AppColors';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_TEXT,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    height: 30,
    padding: 5,
    fontSize: 16,
    borderRadius: 3,
    borderWidth: 1 / 2,
    borderColor: WHITE,
    backgroundColor: WHITE,
    alignSelf: 'stretch',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    width: 40,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconAdd: {
    width: 20,
    height: 20,
    tintColor: LIGHT_TEXT
  }
});
