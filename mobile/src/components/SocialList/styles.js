/**
 * Created by nick on 18/07/16.
 */
import { StyleSheet } from 'react-native';
import { WHITE, PRIMARY_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  socialListContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#E8E8E8',
  },
  socialContainer: {
    paddingTop: 5,
    flex: 1,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 35,
    borderColor: WHITE,
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialLabel: {
    marginTop: 10,
    fontSize: 13,
    color: PRIMARY_TEXT,
    fontWeight: 'bold'
  },
});
