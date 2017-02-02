import { StyleSheet } from 'react-native';
import { WHITE, GRAY } from 'AppColors';
import { NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    // backgroundColor: BG_DARK_GRAY,
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionIcon: {
    color: WHITE,
    marginRight: 10,
  },
  actionText: {
    color: WHITE
  },
  actionImage: {
    width: 10
  },
  wrapper: {
    flex: 1
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
  },
  logo: {
    alignItems: 'center',
    marginTop: 2 * NAVBAR_HEIGHT,
    marginBottom: NAVBAR_HEIGHT,
  },
  lightText: {
    color: WHITE
  },
  backButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    paddingLeft: 25,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  bold: {
    fontWeight: 'bold',
  },
  verifyText: {
    color: WHITE,
    marginTop: 5,
    marginLeft: 50,
    marginRight: 50,
    textAlign: 'center'
  },
  navigation: {
    height: NAVBAR_HEIGHT,
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
  },
  titleLabel: {
    color: WHITE,
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  topicsTitleLabel: {
    color: GRAY,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
  },
  accountsHeaderStyle: {
    flex: 0,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  }
});
