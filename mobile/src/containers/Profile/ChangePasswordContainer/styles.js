import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { BLUE, WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  form: {
    borderTopWidth: 0,
  },
  label: {
    fontSize: 12,
    width: WINDOW_WIDTH * 0.35,
  },
  inputIcon: {
    padding: 5,
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
  forgotPassword: {
    margin: 20,
  },
});
