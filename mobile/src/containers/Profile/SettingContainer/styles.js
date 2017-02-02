import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    width: null,
  },
  blurView: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  blurViewAndroid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
