import { StyleSheet } from 'react-native';
import {
  BORDER_LIGHT_GRAY,
  BG_LIGHT_GRAY,
  PRIMARY_TEXT,
  SECONDARY_TEXT,
  YELLOW
} from 'AppColors';

export const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: BORDER_LIGHT_GRAY,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  sectionText: {
    color: SECONDARY_TEXT,
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Panton-Semibold',
    flex: 1,
  },
  category: {
    borderBottomWidth: 1,
    borderColor: BORDER_LIGHT_GRAY,
    backgroundColor: BG_LIGHT_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  categoryText: {
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Panton-Semibold',
  },
  activeCategoryText: {
    color: YELLOW,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Panton-Semibold',
  },
  colonyList: {
    borderBottomWidth: 1,
    borderColor: BORDER_LIGHT_GRAY,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 5,
  },
  colony: {
    marginVertical: 5,
    marginRight: 5,
  },
});
