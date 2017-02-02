/* eslint-disable max-len */
import React, { PropTypes } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TextSemiBold, LabelText } from 'AppFonts';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { GRAY, YELLOW } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 70,
    width: 70,
    tintColor: GRAY,
    marginBottom: 10,
  },
  selectI: {
    tintColor: YELLOW,
  },
  selectT: {
    color: YELLOW,
  },
});

const buttonsOneImage = [
  { label: 'Pin', icon: require('img/icons/icon_posting_pin.png'), toggle: 'tag' },
  { label: 'Location', icon: require('img/icons/icon_posting_location.png'), toggle: 'location' },
  { label: 'Filter', icon: require('img/icons/icon_posting_filter.png'), toggle: 'filter' },
  { label: 'Text', icon: require('img/icons/icon_posting_text.png'), toggle: 'text' },
  { label: 'Edit', icon: require('img/icons/icon_posting_edit.png'), toggle: 'edit' },
];

const buttonsTwoImage = [
  { label: 'Vertical', icon: require('img/icons/icon_posting_vertical.png'), iconSize: { width: 40 }, toggle: 'vertical' },
  { label: 'Horizontal', icon: require('img/icons/icon_posting_horizontal.png'), iconSize: { width: 40 }, toggle: 'horizontal' },
];

const buttonsThreeImage = [
  { label: 'Vertical', icon: require('img/icons/icon_posting_vertical.png'), iconSize: { width: 40 }, toggle: 'vertical' },
  { label: 'Horizontal', icon: require('img/icons/icon_posting_horizontal.png'), iconSize: { width: 40 }, toggle: 'horizontal' },
];

const buttonsFourImage = [
  { label: 'Vertical', icon: require('img/icons/icon_posting_vertical.png'), iconSize: { width: 40 }, toggle: 'vertical' },
  { label: 'Horizontal', icon: require('img/icons/icon_posting_horizontal.png'), iconSize: { width: 40 }, toggle: 'horizontal' },
  { label: 'Quad', icon: require('img/icons/icon_posting_quad.png'), iconSize: { width: 40 }, toggle: 'quad' },
];

const getButtons = (length) => {
  switch (length) {
    case 1:
      return buttonsOneImage;
    case 2:
      return buttonsTwoImage;
    case 3:
      return buttonsThreeImage;
    case 4:
      return buttonsFourImage;
    default:
      return buttonsOneImage;
  }
};

export function OptionsBar({ toggleOptions, toggle, imageLength }) {
  const buttons = getButtons(imageLength);
  return (
    <View style={styles.container}>
      {buttons.map((button, i) => (
        <TouchableOpacity key={i} onPress={() => toggleOptions(button.toggle)}>
          <View style={styles.button}>
            <Image
              source={button.icon}
              style={[styles.icon, toggle === button.toggle && styles.selectI]}
            />
            <TextSemiBold style={toggle === button.toggle && styles.selectT}>{button.label}</TextSemiBold>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

OptionsBar.propTypes = {
  toggleOptions: PropTypes.func.isRequired,
  toggle: PropTypes.string.isRequired,
  imageLength: PropTypes.number.isRequired,
};

OptionsBar.defaultProps = {
  toggle: '',
  imageLength: 1
};
