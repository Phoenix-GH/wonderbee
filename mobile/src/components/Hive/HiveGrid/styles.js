import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hexagons: {
    flexDirection: 'row',
  },
  rightHexagon: {
    alignSelf: 'flex-end',
  },
  leftHexagon: {
    alignSelf: 'flex-start',
  },
  oneHexagonRow: {
    justifyContent: 'center',
  },
  twoHexagonsRow: {
    justifyContent: 'space-between',
  }
});
