import { StyleSheet } from 'react-native';
import { BG_LIGHT_GRAY, PRIMARY_TEXT, AUX_TEXT, RED } from 'AppColors';
import { NAVBAR_HEIGHT } from 'AppConstants';

export const styles = StyleSheet.create({
  listView: {
    borderTopWidth: 1,
    borderColor: BG_LIGHT_GRAY,
  },
  scrollContent: {
    paddingBottom: NAVBAR_HEIGHT,
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: BG_LIGHT_GRAY,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  imageContainer: {
    paddingRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Panton-Semibold',
  },
  smallText: {
    color: AUX_TEXT,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Panton-Semibold',
  },
  messageContainer: {
    borderTopWidth: 1,
    borderColor: BG_LIGHT_GRAY,
    padding: 20,
  },
  message: {
    color: AUX_TEXT,
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Panton-Semibold',
    textAlign: 'center',
  },
  error: {
    color: RED,
  },
});
