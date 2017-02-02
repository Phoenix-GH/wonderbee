import { StyleSheet } from 'react-native';
import { GRAY, BG_MEDIUM_GRAY, BG_LIGHT_GRAY, PRIMARY_TEXT } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_MEDIUM_GRAY,
  },
  sendButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: GRAY,
    marginLeft: 15,
  },
  send: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    alignSelf: 'center',
    flex: 1,
    borderRadius: 2,
    borderColor: BG_LIGHT_GRAY,
    backgroundColor: BG_LIGHT_GRAY,
    borderWidth: 1,
    padding: 5,
    paddingTop: 3,
    fontSize: 12
  },
  placeholderIconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    right: 15,
    top: 0,
    bottom: 0,
    width: 15,
  },
  iconCommentPlaceholder: {
    width: 15,
    height: 13
  },
  cameraIconView: {
    marginLeft: 5,
    marginRight: 8
  },
  cameraIconImage: {
    width: 21,
    height: 18,
    tintColor: PRIMARY_TEXT
  }
});
