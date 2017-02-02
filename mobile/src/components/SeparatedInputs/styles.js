import { StyleSheet } from 'react-native';
import {
  YELLOW,
  WHITE,
  AUX_TEXT,
  PRIMARY_TEXT,
  SECONDARY_TEXT,
  BLACK,
  GRAY,
} from 'AppColors';

import {
  HEXAGON_IMAGE_SIZE,
  WINDOW_WIDTH as width,
  WINDOW_HEIGHT as height,
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
  twoInputs: {
    width: width * 3 / 4,
    justifyContent: 'space-between'
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
    color: WHITE
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
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  placeholder: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  normalizeButton: {
    height: 30,
    width: 140
  }
});
