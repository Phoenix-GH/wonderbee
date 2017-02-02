/**
 * Created by nick on 20/06/16.
 */
import React, { PropTypes } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  img: {
    width: 18,
    height: 18,
    marginLeft: 5
  }
});

export function Close({ close, style, containerStyle }) {
  return (
    <TouchableOpacity onPress={close} style={containerStyle}>
      <Image
        source={require('img/icons/icon_cancel.png')}
        style={[styles.img, style]}
      />
    </TouchableOpacity>
  );
}

Close.propTypes = {
  close: PropTypes.func.isRequired,
  style: PropTypes.any,
  containerStyle: PropTypes.any,
};
