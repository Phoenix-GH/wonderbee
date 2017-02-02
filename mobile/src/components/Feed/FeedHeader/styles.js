import { StyleSheet } from 'react-native';
import { AUX_TEXT, YELLOW } from 'AppColors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  rowPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  containerWithName: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  ago: {
    fontSize: 12,
    paddingVertical: 5,
    textAlign: 'left',
    color: AUX_TEXT,
  },
  votes: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  voteText: {
    marginLeft: 5,
    fontSize: 18,
  },
  icon: {
    fontSize: 30,
    color: YELLOW,
  },
});
