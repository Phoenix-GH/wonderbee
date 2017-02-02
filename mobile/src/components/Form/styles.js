import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { AUX_TEXT, VALID_TEXT, INVALID_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: AUX_TEXT,
  },
  row: {
    borderBottomWidth: 1,
    borderColor: AUX_TEXT,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    width: WINDOW_WIDTH * 0.25,
  },
  multilineLabel: {
    paddingTop: 5,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontFamily: 'Panton-Semibold',
    fontSize: 16,
    height: 40,
  },
  success: {
    color: VALID_TEXT,
  },
  error: {
    color: INVALID_TEXT,
    fontFamily: 'Panton-Semibold',
    fontSize: 12,
    marginBottom: 10,
  }
});
