import { StyleSheet } from 'react-native';
import { PRIMARY_TEXT, BG_DARK_GRAY, LIGHT_GREEN, GREEN, BG_MEDIUM_GRAY, WHITE, BG_LIGHT_GRAY } from 'AppColors';
export const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 5
  },
  wrap: {
    flex: 1,
  },
  start: {
    alignItems: 'flex-start',
  },
  end: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  padding: {
    paddingHorizontal: 15,
  },
  rowContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: BG_MEDIUM_GRAY
  },
  systemMessageContainer: {
    padding: 7,
    borderRadius: 7,
    backgroundColor: BG_MEDIUM_GRAY
  },
  labelDate: {
    color: WHITE
  },
  messageArea: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    minHeight: 40,
    borderRadius: 10,
    justifyContent: 'center',
  },
  receiveMessageArea: {
    marginLeft: 53,
    marginRight: 12,
    backgroundColor: BG_LIGHT_GRAY,
    borderColor: BG_LIGHT_GRAY,
  },
  senderMessageArea: {
    backgroundColor: LIGHT_GREEN,
    borderColor: LIGHT_GREEN,
    alignItems: 'flex-end',
    marginLeft: 53,
    marginRight: 12,
  },
  sendMessageInfo: {
    height: 12,
    marginRight: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  sendBubble1: {
    position: 'absolute',
    right: 0,
    top: -3,
    width: 4,
    height: 4,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: LIGHT_GREEN,
    borderColor: LIGHT_GREEN,
  },
  sendBubble2: {
    position: 'absolute',
    right: 4,
    top: 1,
    width: 7,
    height: 7,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: LIGHT_GREEN,
    borderColor: LIGHT_GREEN,
  },
  receiveBubble1: {
    position: 'absolute',
    left: 43,
    top: 11,
    width: 4,
    height: 4,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: BG_LIGHT_GRAY,
    borderColor: BG_LIGHT_GRAY,
  },
  receiveBubble2: {
    position: 'absolute',
    left: 47,
    top: 15,
    width: 7,
    height: 7,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: BG_LIGHT_GRAY,
    borderColor: BG_LIGHT_GRAY,
  },
  receiveMessageInfo: {
    height: 12,
    marginLeft: 58,
    marginBottom: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  senderAvatarContainer: {
    marginLeft: -3
  },
  recvAvatarContainer: {
    position: 'absolute',
    left: 0,
  },
  message: {
    color: PRIMARY_TEXT,
    fontSize: 14,
  },
  messageMultiLine: {
    color: PRIMARY_TEXT,
    paddingBottom: 3,
    fontSize: 14,
  },
  timeText: {
    fontSize: 9,
    color: PRIMARY_TEXT
  },
  username: {
    fontSize: 12,
    color: BG_DARK_GRAY,
  },
  messageTimeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 2,
  },
  rowSep: {
    width: 10,
  }
});
