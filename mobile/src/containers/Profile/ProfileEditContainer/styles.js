import { StyleSheet } from 'react-native';
import { GRAY, YELLOW } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  flex: {
    flex: 1
  },
  margin: {
    marginTop: 10,
  },
  phoneEditContainer: {
    width: WINDOW_WIDTH,
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  dialCodeView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingLeft: 10
  },
  phoneInput: {
    flex: 1,
    height: 40,
    fontSize: 15
  }
});
