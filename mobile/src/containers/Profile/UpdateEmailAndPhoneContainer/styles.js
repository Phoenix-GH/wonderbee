import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { WHITE, BLUE } from 'AppColors';

export const styles = StyleSheet.create({
  form: {
    borderTopWidth: 0,
  },
  inputIcon: {
    paddingLeft: 5,
  },
  submit: {
    borderColor: BLUE,
    backgroundColor: BLUE,
    margin: 20,
    marginBottom: 0,
  },
  submitLabel: {
    color: WHITE
  },
});
