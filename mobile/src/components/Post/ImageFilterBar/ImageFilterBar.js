/* eslint-disable max-len */
import React, { PropTypes } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Slider, StyleSheet } from 'react-native';
import { TextSemiBold, LabelText } from 'AppFonts';
import { GRAY, YELLOW } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
  },
  button: {
    width: 70,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    tintColor: GRAY,
    marginBottom: 10,
    height: 70,
    width: 70,
  },
  sliderContainer: {
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  valueLabel: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 10,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: YELLOW,
    borderRadius: 5,
    top: 10,
  },
  spacer: {
    width: 10,
    height: 10,
  },
});

const filters = [
  { icon: require('img/icons/icon_posting_structure.png'), label: 'Detail', default: 0, },
  { icon: require('img/icons/icon_posting_sepia.png'), label: 'Sepia', default: 0 },
  { icon: require('img/icons/icon_posting_hue.png'), label: 'Hue', default: 0 },
  { icon: require('img/icons/icon_posting_blur.png'), label: 'Blur', default: 0 },
  { icon: require('img/icons/icon_posting_sharp.png'), label: 'Sharpen', default: 0 },
  { icon: require('img/icons/icon_add_new.png'), label: 'Negative', default: 0 },
  { icon: require('img/icons/icon_posting_contrast.png'), label: 'Contrast', default: 1 },
  { icon: require('img/icons/icon_posting_saturation.png'), label: 'Saturation', default: 1 },
  { icon: require('img/icons/icon_posting_brightness.png'), label: 'Brightness', default: 1 },
  { icon: require('img/icons/icon_posting_temperature.png'), label: 'Temperature', default: 6500 },
];

function Option({ icon, label, onPress, notDefault }) {
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress(label)}>
      <View style={styles.buttonInner}>
        <Image source={icon} style={styles.icon} />
        <TextSemiBold>
          {label}
        </TextSemiBold>
        {notDefault ? <View style={styles.dot} /> : <View style={styles.spacer} />}
      </View>
    </TouchableOpacity>
  );
}

Option.propTypes = {
  icon: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  notDefault: PropTypes.bool.isRequired,
};

export function ImageFilterBar(props) {
  const renderSlider = (label) => {
    const standardizeValue = (tempValue, reverse = false) => {
      const mapRanges = (value, standardMin = 0, standardMax = 100, newMin = 0, newMax = 1) => {
        const standardSpan = standardMax - standardMin;
        const newSpan = newMax - newMin;
        const scaledValue = (value - standardMin) / standardSpan;
        return newMin + scaledValue * newSpan;
      };
      if (label === 'temperature') {
        return !reverse ? mapRanges(tempValue, -100, 100, 1750, 11750) : mapRanges(1750, 11750, -100, 100);
      }
      if (label === 'contrast' || label === 'saturation' || label === 'brightness') {
        return !reverse ? mapRanges(tempValue, -100, 100, 0, 2) : mapRanges(tempValue, 0, 2, -100, 100);
      }
      return !reverse ? mapRanges(tempValue) : mapRanges(tempValue, 0, 1, 0, 100);
    };
    const sliderOptions = {
      minimumValue: 0,
      maximumValue: 100,
      step: 1,
      value: standardizeValue(props[label].value || props[label], true) || 0,
    };
    if (label === 'temperature' || label === 'contrast' || label === 'saturation' || label === 'brightness') {
      sliderOptions.minimumValue = -100;
      sliderOptions.maximumValue = 100;
    }
    return (
      <View style={styles.sliderContainer}>
        <TextSemiBold style={styles.valueLabel}>{Math.floor(sliderOptions.value)}</TextSemiBold>
        <Slider
          {...sliderOptions}
          onValueChange={(value) =>
            props.setNewFilterValue(standardizeValue(value), label)
          }
        />
      </View>
    );
  };

  if (props.showSlider) {
    return renderSlider(props.label.toLowerCase());
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      bounces={false}
    >
      {/* <Option icon={require('img/icons/icon_posting_rotate.png')} label="Rotate" onPress={props.rotateImage} notDefault={props.rotate !== '0deg'} /> */}
      {filters.map((filter, i) => {
        const value = filter.label === 'Detail' ? props[filter.label.toLowerCase()].value : props[filter.label.toLowerCase()];
        return (
          <Option key={i} {...filter} onPress={props.toggleSlider} notDefault={value !== filter.default} />
        );
      })}
    </ScrollView>
  );
}

ImageFilterBar.propTypes = {
  showSlider: PropTypes.bool.isRequired,
  toggleSlider: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  setNewFilterValue: PropTypes.func.isRequired,
  rotate: PropTypes.string,
  hue: PropTypes.number,
  blur: PropTypes.number,
  sepia: PropTypes.number,
  sharpen: PropTypes.number,
  negative: PropTypes.number,
  contrast: PropTypes.number,
  saturation: PropTypes.number,
  brightness: PropTypes.number,
  temperature: PropTypes.number,
  detail: PropTypes.object,
  rotateImage: PropTypes.func.isRequired,
};

ImageFilterBar.defaultProps = {
  hue: 0,
  blur: 0,
  sepia: 0,
  sharpen: 0,
  negative: 0,
  contrast: 1,
  saturation: 1,
  brightness: 1,
  temperature: 6500,
  detail: { contrast: 0, sharpen: 0, saturation: 0, value: 0 },
};
