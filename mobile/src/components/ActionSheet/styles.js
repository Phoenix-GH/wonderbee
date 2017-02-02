import { StyleSheet } from 'react-native';
import { WHITE, SEMI_OPAQUE_BG, ACTION_SHEET_BUTTON } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SEMI_OPAQUE_BG
  },
  buttonsBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20
  },
  button: {
    backgroundColor: ACTION_SHEET_BUTTON,
    marginBottom: 10,
  },
  cancel: {
    marginTop: 10
  },
  buttonLabel: {
    color: WHITE
  },
});
