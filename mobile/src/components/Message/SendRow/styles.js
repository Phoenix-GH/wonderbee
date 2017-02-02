import { StyleSheet } from 'react-native';
import { GREEN, BG_LIGHT_GRAY, PRIMARY_TEXT, WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_LIGHT_GRAY,
  },
  sendButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
    marginLeft: 15,
  },
  send: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  input: {
    alignSelf: 'center',
    flex: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingRight: 10,
    paddingLeft: 40,
    paddingTop: 3,
    fontSize: 12,
    color: PRIMARY_TEXT,
    fontFamily: 'Panton-Semibold',
  },
  sendContainer: {
    marginLeft: 15,
    padding: 5,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  iconContainer: {
    marginLeft: 15,
  },
  emoIconContainer: {
    position: 'absolute',
    left: 25,
    top: 10,
  },
  iconEmoticon: {
    width: 20,
    height: 20,
    tintColor: PRIMARY_TEXT
  },
  iconCamera: {
    width: 25,
    height: 25,
  },
  iconSend: {
    width: 25,
    height: 22,
  }
});
