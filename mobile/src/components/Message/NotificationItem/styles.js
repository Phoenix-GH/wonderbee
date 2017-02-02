import { StyleSheet } from 'react-native';
import { YELLOW, PRIMARY_TEXT, AUX_TEXT } from 'AppColors';
export const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    fontSize: 30,
  },
  iconPressed: {
    color: 'tomato',
  },
  container: {
    backgroundColor: '#FFF',
  },
  optionContainer: {
    marginLeft: 10,
    width: 30,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSelect: {
    width: 18,
    height: 18,
    borderColor: AUX_TEXT,
    borderWidth: 1 / 2,
    borderRadius: 18
  },
  notificationContainer: {
    borderBottomWidth: 1 / 2,
    borderBottomColor: AUX_TEXT,
    paddingLeft: 10,
    paddingRight: 15,
    paddingVertical: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  participants: {
    flex: 1,
    color: PRIMARY_TEXT,
    flexWrap: 'wrap',
  },
  updatedAt: {
    fontSize: 12,
    color: AUX_TEXT,
    textAlign: 'right',
  },
  imageContainer: {
    width: 45,
    height: 45,
  },
  logoImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AUX_TEXT
  },
  content: {
    color: PRIMARY_TEXT,
    fontSize: 10,
    lineHeight: 18,
    marginBottom: 5,
  },
  readIndicator: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: YELLOW
  },
  iconLogo: {
    width: 17,
    height: 20
  },
  postImageView: {
    flex: 1,
    flexDirection: 'row'
  },
  messageView: {
    flex: 1
  },
  updatedAtView: {
    flex: 1
  }
});
