import React, { PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WHITE } from 'AppColors';
import { TextSemiBold } from 'AppFonts';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  subContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinCount: {
    color: WHITE,
    fontSize: 22,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  icon: {
    width: 10,
    height: 10,
    tintColor: WHITE,
    marginLeft: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 5,
  },
});

export function PinCount({ count }) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image style={styles.icon} size={20} source={require('img/icons/icon_posting_pin.png')} />
      </View>
    </View>
  );
}

PinCount.propTypes = {
  count: PropTypes.number
};
