import { StyleSheet, Platform } from 'react-native';
import {
  WHITE,
  SEMI_OPAQUE_BG,
  BORDER_GRAY,
  GRAY,
  YELLOW,
  GREEN,
  LIGHT_GRAY,
} from 'AppColors';
import { WINDOW_HEIGHT, NAVBAR_HEIGHT, WINDOW_WIDTH, STATUSBAR_HEIGHT } from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    height: WINDOW_HEIGHT
  },
  followAll: {
    width: 100,
    height: 30
  },
  followText: {
    color: GRAY,
    fontWeight: 'bold'
  },
  loader: {
    marginTop: 50
  },
  followLabel: {
    fontSize: 12,
    color: SEMI_OPAQUE_BG,
    fontWeight: 'bold'
  },
  header: {
    marginTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: BORDER_GRAY
  },
  listView: {
    flex: 1,
    height: WINDOW_HEIGHT - NAVBAR_HEIGHT - 50,
    width: WINDOW_WIDTH,
  },
  rowContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    alignItems: 'center',
    borderBottomColor: BORDER_GRAY
  },
  rowTextContent: {
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    height: 30
  },
  rowSecondaryText: {
    color: SEMI_OPAQUE_BG,
    fontSize: 10
  },
  rowAddIcon: {
    width: 30,
    height: 30,
  },
  rowAddButtonContainer: {
    borderColor: BORDER_GRAY
  },
  rowActionButton: {
    borderColor: SEMI_OPAQUE_BG,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.6
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  following: {
    backgroundColor: YELLOW
  },
  hexagonImageMarginRight: {
    marginRight: 10
  },
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notFound: {
    fontSize: 20,
    color: GRAY,
    textAlign: 'center'
  },
  top: {
    flex: 0,
    height: NAVBAR_HEIGHT,
    ...Platform.select({
      ios: {
        height: NAVBAR_HEIGHT,
      },
      android: {
        height: NAVBAR_HEIGHT - STATUSBAR_HEIGHT,
      },
    }),
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        bottom: 0,
      },
      android: {
        bottom: STATUSBAR_HEIGHT,
      },
    }),
    right: 0,
    left: 0,
    position: 'absolute',
    borderTopWidth: 3,
    paddingTop: 2,
    backgroundColor: WHITE,
    borderColor: LIGHT_GRAY,
  },
  titleLabel: {
    color: WHITE,
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  left: {
    marginLeft: 25,
  },
  right: {
    marginRight: 25,
  },
  centerButton: {
    height: NAVBAR_HEIGHT / 2,
    borderRadius: NAVBAR_HEIGHT / 4,
    backgroundColor: GREEN,
    width: WINDOW_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteText: {
    color: WHITE,
  },
  grayText: {
    color: GRAY,
  },
  bold: {
    fontWeight: 'bold',
  },
});
