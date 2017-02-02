import { StyleSheet } from 'react-native';
import {
  LIGHT_TEXT,
  BG_MEDIUM_GRAY,
  PRIMARY_TEXT,
  WHITE,
  DARK_GRAY,
} from 'AppColors';

export const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  iconNewThread: {
    width: 23,
    height: 23,
    tintColor: WHITE,
  },
  toggleMessageIcon: {
    width: 24,
    height: 20,
    tintColor: DARK_GRAY,
    marginRight: 20,
  },
  iconSelectThread: {
    width: 25,
    height: 23,
    tintColor: WHITE,
  },
  toggleAlertIcon: {
    width: 18,
    height: 20,
    tintColor: DARK_GRAY,
    marginRight: 20,
  },
  deletePanelContainer: {
    height: 35,
    backgroundColor: LIGHT_TEXT,
    paddingVertical: 5,
    paddingHorizontal: 30,
    flexDirection: 'row'
  },
  iconSelectAllThread: {
    width: 22,
    height: 20,
  },
  iconDelete: {
    width: 15,
    height: 20
  },
  bottomButton: {
    width: 100,
    alignSelf: 'stretch',
    borderRadius: 5,
    borderWidth: 1 / 2,
    borderColor: BG_MEDIUM_GRAY,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnSelectAll: {
    backgroundColor: WHITE
  },
  btnDelete: {
    borderColor: PRIMARY_TEXT,
    backgroundColor: PRIMARY_TEXT
  },
  btnDeleteLabel: {
    color: WHITE
  },
  deletePanelSelectAllView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  deletePanelDeleteView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  leftLabelView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80
  },
  leftLabelText: {
    fontSize: 12,
    color: WHITE,
  },
  rightLabelView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  centerLabelText: {
    color: WHITE,
    backgroundColor: 'transparent',
  },
  loadingText: {
    textAlign: 'center'
  }
});
