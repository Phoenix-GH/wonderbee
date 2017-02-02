import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT } from 'AppConstants';
import { WHITE, DARK_GRAY } from 'AppColors';

export const customTextInputStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  textInput: {
    alignSelf: 'stretch',
    height: WINDOW_HEIGHT / 20,
    fontSize: 14,
    fontWeight: '500',
    color: WHITE,
    borderWidth: 0,
    paddingLeft: 0,
  },
  textInputPadding: {
    paddingLeft: 20,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderColor: WHITE,
  },
  image: {
    position: 'absolute',
    top: WINDOW_HEIGHT / 40 - 7.5,
    left: 5,
  },
  iconAdd: {
    width: 15,
    height: 15,
  },
  multiScroll: {
    marginTop: 5,
    height: 25,
    alignSelf: 'stretch',
  },
  selected: {
    height: 25,
  },
  selectedText: {
    fontSize: 14,
    color: DARK_GRAY,
    fontWeight: 'bold',
  },
  result: {
    marginVertical: 5,
  },
  name: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  noResult: {
    marginTop: 5,
    alignItems: 'center',
  },
  clear: {
    position: 'absolute',
    top: 0,
    height: WINDOW_HEIGHT / 20,
    justifyContent: 'center',
    right: 5,
  },
  iconClear: {
    width: 8,
    height: 8,
    tintColor: WHITE,
  },
  listDone: {
    position: 'absolute',
    right: 5,
  },
});
