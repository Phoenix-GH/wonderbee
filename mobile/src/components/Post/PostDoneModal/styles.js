import { StyleSheet } from 'react-native';
import { YELLOW, LIGHT_GRAY, WHITE } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const smallRow = WINDOW_WIDTH / 4;
const tinyRow = WINDOW_WIDTH / 5;

export const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: WINDOW_WIDTH / 2,
    backgroundColor: LIGHT_GRAY,
  },
  buttonSimple: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: WINDOW_WIDTH / 4,
  },
  postImageContainer: {
    width: WINDOW_WIDTH / 3,
    height: WINDOW_WIDTH / 3 * 4 / 3,
    backgroundColor: WHITE,
    borderRadius: 5,
    overflow: 'hidden',
  },
  postDescription: {
    paddingVertical: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: LIGHT_GRAY,
  },
  description: {
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
    fontFamily: 'ProximaNova-Semibold',
    padding: 10,
    backgroundColor: LIGHT_GRAY,
    height: WINDOW_WIDTH / 3 * 4 / 3,
    width: WINDOW_WIDTH * 2 / 3 - 50,
    borderRadius: 5,
  },
  buttonRow: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: smallRow,
  },
  labelRow: {
    height: tinyRow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberRow: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  votingButton: {
    width: WINDOW_WIDTH * 3 / 8,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: LIGHT_GRAY,
  },
  activeFeedbackButton: {
    borderColor: YELLOW,
  },
  activeHeatmapButton: {
    borderColor: 'red',
    backgroundColor: '#000',
  },
  activeFeedbackLabel: {
    color: '#000',
  },
  activeHeatmapLabel: {
    color: WHITE,
  },
  icon: {
    height: 50,
    width: 50,
    marginHorizontal: 20,
  },
  groupEmoji: {
    height: 20,
    width: 20,
  },
  groupIconRow: {
    justifyContent: 'space-around',
    height: 25,
    width: 45,
    alignItems: 'center',
  },
  buttonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: WINDOW_WIDTH,
    borderTopWidth: 1,
    borderBottomWidth: 3,
  },
  number: {
    fontSize: 28,
  },
  slider: {
    width: WINDOW_WIDTH * 2 / 3,
  },
  whiteLabel: {
    position: 'absolute',
    top: -3,
    left: 50,
    height: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  whiteLabelText: {
    color: '#000'
  },
  emojiMessage: {
    height: 50,
    width: WINDOW_WIDTH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
