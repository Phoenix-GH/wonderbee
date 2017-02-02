import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { WHITE, BG_DARK_GRAY, SECONDARY_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: SECONDARY_TEXT,
    marginBottom: 10,
  },
  input: {
    width: WINDOW_WIDTH,
    height: 50,
    color: WHITE,
    backgroundColor: BG_DARK_GRAY,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    height: WINDOW_HEIGHT / 20,
  },
  rowText: {
    color: WHITE,
  },
  listView: {
    flex: 1,
  },
  flexStart: {
    justifyContent: 'flex-start'
  },
  marginRight: {
    marginRight: 10
  },
});
