import { StyleSheet } from 'react-native';
import { AUX_TEXT, YELLOW, WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: AUX_TEXT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  username: {
    marginLeft: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 88,
    borderWidth: 1,
    borderRadius: 5,
  },
  following: {
    backgroundColor: YELLOW,
    borderWidth: 0,
  },
  followingImage: {
    tintColor: WHITE,
  },
  image: {
    height: 25,
    width: 52
  }
});
