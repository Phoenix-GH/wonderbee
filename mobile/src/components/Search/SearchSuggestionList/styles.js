import { StyleSheet } from 'react-native';
import { PRIMARY_TEXT, SECONDARY_TEXT, AUX_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Panton-Semibold',
    flex: 1,
  },
  instructions: {
    color: AUX_TEXT,
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Panton-Semibold',
    textAlign: 'right',
    flex: 1,
  },
  listView: {
    borderTopWidth: 1,
    borderColor: AUX_TEXT,
  },
  listItem: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: AUX_TEXT,
    backgroundColor: '#ebece9',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  imageContainer: {
    paddingRight: 20,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: SECONDARY_TEXT,
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Panton-Semibold',
  },
});
