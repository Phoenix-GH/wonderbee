import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  button: {
    width: 25,
    height: 25,
  }
});
