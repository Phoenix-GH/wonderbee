import { StyleSheet } from 'react-native';
import { AUX_TEXT } from 'AppColors';

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
  },
  heading: {
    marginLeft: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 88,
    borderWidth: 1,
    borderRadius: 5,
  },
  settings: {
    height: 25,
    width: 25,
  },
  group: {
    height: 25,
    width: 52,
  }
});
