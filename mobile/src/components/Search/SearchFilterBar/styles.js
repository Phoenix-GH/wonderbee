import { StyleSheet } from 'react-native';
import { PRIMARY_TEXT, AUX_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  filterContainer: {
    borderRightWidth: 1,
    borderColor: AUX_TEXT,
    flex: 1,
    paddingVertical: 3,
  },
  filter: {
    color: AUX_TEXT,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Panton-Semibold',
    textAlign: 'center',
  },
  activeFilter: {
    color: PRIMARY_TEXT,
  },
});
