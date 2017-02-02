import { StyleSheet } from 'react-native';
import { GRAY, WHITE, PRIMARY_TEXT, SECONDARY_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    alignSelf: 'stretch',
    borderRadius: 6,
    backgroundColor: WHITE,
    color: PRIMARY_TEXT,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    textAlign: 'center',
    height: 35,
    paddingHorizontal: 15,
  },
  icon: {
    height: 15,
    width: 15,
    tintColor: SECONDARY_TEXT,
    top: -25.5,
    left: -35,
  },
});
