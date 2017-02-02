import { StyleSheet } from 'react-native';
import {
  YELLOW,
  WHITE,
  AUX_TEXT,
  PRIMARY_TEXT,
  SECONDARY_TEXT,
  BLACK,
  GREEN
} from 'AppColors';

import {
  HEXAGON_IMAGE_SIZE,
  WINDOW_WIDTH as width,
  WINDOW_HEIGHT as height,
  NAVBAR_HEIGHT,
} from 'AppConstants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  space: {
    marginBottom: height / 30,
  },
  adjustTop: {
    top: height / 24,
  },
  alignMiddle: {
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    height: 18,
    width: 18,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 9,
    right: 4,
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldButton: {
    backgroundColor: YELLOW,
    width,
    height: height / 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButton: {
    borderRadius: height / 30,
    width: width / 2,
  },
  logo: {
    width: width / 5,
    height: width / 5,
    marginTop: 2 * NAVBAR_HEIGHT,
    marginBottom: 30,
  },
  signupButton: {
    borderColor: WHITE,
    borderRadius: height / 30,
    width: width / 3,
  },
  signupButtonContainer: {
    height: height / 30 + 4,
    justifyContent: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    justifyContent: 'center',
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  twoInputs: {
    width: width * 3 / 4,
    justifyContent: 'space-between'
  },
  genderContainer: {

  },
  icon: {
    color: AUX_TEXT,
    fontSize: 20,
    marginRight: 10,
  },
  loginIcon: {
    height: height / 20,
    width: height / 20,
  },
  top: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    width,
    flex: 1
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  normalizeContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 0
  },
  bottom: {
    backgroundColor: 'rgba(170, 170, 170, 0.1)',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width,
    height: height / 12
  },
  terms: {
    borderTopWidth: 1,
    borderColor: AUX_TEXT,
    paddingTop: height / 24,
    paddingBottom: height / 24,
    width: width * 5 / 6,
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderColor: WHITE,
  },
  inputFont: {
    fontFamily: 'Panton-Semibold',
  },
  input: {
    width: width * 3 / 4 - height / 20,
    height: height / 20,
    color: WHITE,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    padding: 0,
  },
  textInputIcon: {
    height: height / 20,
    width: height / 20,
  },
  geolocationListView: {
    width: width * 3 / 4,
  },
  geolocationInputWrapper: {
    borderBottomWidth: 1,
    borderColor: SECONDARY_TEXT,
    width: width * 3 / 4,
  },
  inputHalf: {
    width: width * 3 / 8 - 10,
  },
  inputTextCenter: {
    textAlign: 'center',
  },
  errorText: {
    color: SECONDARY_TEXT,
    top: height / 20 + 3
  },
  picker: {
    height: height / 3,
  },
  lightText: {
    color: WHITE,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  blackText: {
    color: BLACK
  },
  primaryText: {
    color: PRIMARY_TEXT
  },
  fitLabel: {
    textAlign: 'center',
    width: width * 3 / 4
  },
  containerLabel: {
    color: WHITE,
    fontSize: 19
  },
  alertLabel: {
    color: WHITE,
    fontSize: 28
  },
  signupHeaderLabel: {
    color: AUX_TEXT,
    fontSize: 25,
  },
  noteLabel: {
    fontSize: 11
  },
  innerSpacing: {
    paddingVertical: 10
  },
  innerSpacingHoriz: {
    paddingHorizontal: 10
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 20
  },
  topicsMiddleContainer: {
    flex: 4,
  },
  topicsTextContainer: {
    flex: 2,
  },
  phoneCode: {
    fontSize: 30,
    letterSpacing: 20,
    width: width / 6,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
    textDecorationColor: WHITE
  },
  floatRight: {
    position: 'absolute',
    right: 0
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  topics: {
    width,
  },
  topicsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: HEXAGON_IMAGE_SIZE,
    justifyContent: 'center'
  },
  loading: {
    flex: 1
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  whiteText: {
    color: 'white',
    fontSize: 20
  },
  whiteNormal: {
    color: WHITE
  },
  flex: {
    flex: 1
  },
  backButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    paddingLeft: 25,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  textMiddleSize: {
    fontSize: 20
  },
  textSmallSize: {
    fontSize: 15
  },
  spaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  transparentBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  relativeInput: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    width: void(0)
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  addImageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: width / 4,
    height: width / 4,
    borderRadius: 15
  },
  bottomSignup: {
    height: 3 * NAVBAR_HEIGHT / 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  titleLabel: {
    color: WHITE,
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
  },
  centerButton: {
    height: 3 * NAVBAR_HEIGHT / 4,
    borderRadius: 3 * NAVBAR_HEIGHT / 8,
    backgroundColor: GREEN,
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findFriendsImage: {
    width: width / 3,
    height: width / 3,
    marginTop: 30
  },
  findFriendsText: {
    color: WHITE,
    fontSize: 30,
    textAlign: 'center'
  },
  findFriendsSubText: {
    textAlign: 'center',
    color: WHITE,
    marginTop: 5,
    marginBottom: 10
  },
  searchContactsBtn: {
    width: 3 * width / 4,
    borderColor: WHITE
  },
  findFriendsConnectFacebook: {
    width: 3 * width / 4,
    borderColor: WHITE
  }
});

export const topicStateStyles = {
  selected: {
    borderWidth: 1,
    borderColor: YELLOW,
    opacity: 0.5,
    textColor: YELLOW
  },
  default: {
    borderWidth: 1,
    borderColor: SECONDARY_TEXT,
    textColor: WHITE,
  },
};
