import React, { PropTypes } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3,
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    height: 75,
    width: 75,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    top: 25,
  },
  label: {
    color: WHITE,
    fontSize: 20,
  },
  biglabel: {
    color: WHITE,
    fontSize: 30,
  },
  remove: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  removeIcon: {
    height: 20,
    width: 20,
  },
});

export function PreviewBottomBar({ images, routeScene, routeBack, removeImage }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {images.length > 0 ? images.map((img, i) => (
          <View key={i}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity style={styles.remove} onPress={() => removeImage(img)}>
              <Image
                source={require('img/icons/icon_posting_remove.png')}
                style={styles.removeIcon}
              />
            </TouchableOpacity>
          </View>
        )) : (
          <LabelText style={styles.biglabel}>Select Media</LabelText>
        )}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={routeBack}>
          <LabelText style={styles.label}>Cancel</LabelText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={routeScene}>
          <LabelText style={styles.label}>Next</LabelText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

PreviewBottomBar.propTypes = {
  images: PropTypes.array,
  routeScene: PropTypes.func.isRequired,
  routeBack: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
};
