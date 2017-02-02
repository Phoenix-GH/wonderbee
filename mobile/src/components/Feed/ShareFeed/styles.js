import { StyleSheet } from 'react-native';
import {
  WHITE,
  BG_OFF_GRAY,
  AUX_TEXT,
  PRIMARY_TEXT,
  YELLOW,
  SECONDARY_TEXT,
} from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignSelf: 'stretch',
    opacity: 0.6
  },
  dimBackground: {
    backgroundColor: BG_OFF_GRAY,
  },
  viewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 300,
    backgroundColor: WHITE
  },
  searchContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1 / 2,
    borderColor: AUX_TEXT,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: PRIMARY_TEXT
  },
  flagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 15,
    textAlign: 'center',
  },
  typeToSearch: {
    marginTop: 10,
    color: SECONDARY_TEXT,
    textAlign: 'center',
  },
  userListContainer: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 10,
  },
  userContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userLabel: {
    marginTop: 10,
    fontSize: 13,
    color: PRIMARY_TEXT,
    fontWeight: 'bold'
  },
  modalTouchable: {
    flex: 1
  },
  modalSearchImage: {
    width: 20,
    height: 20
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    width: void(0),
  },
  buttonLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  flex: {
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yellow: {
    color: YELLOW,
  },
});

export const hexagonStates = {
  default: {},
  selected: {
    borderWidth: 1,
    borderColor: YELLOW,
    opacity: 0.3,
    textColor: YELLOW
  },
};
