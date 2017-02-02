/**
 * Created by nick on 28/06/16.
 */
import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LabelText } from 'AppFonts';
import { PRIMARY_TEXT, LIGHT_TEXT, BG_LIGHT_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  track: {
    backgroundColor: LIGHT_TEXT,
    alignSelf: 'stretch',
    height: 35,
    flexDirection: 'row'
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: PRIMARY_TEXT,
  },
  selectedOption: {
    backgroundColor: BG_LIGHT_GRAY
  },
  selectedOptionText: {
    color: PRIMARY_TEXT
  }
});

const getSelectedStyle = (options, value, selectedStyles, selectedStyle) => {
  if (selectedStyle) {
    return selectedStyle;
  } else if (selectedStyles && selectedStyles[value]) {
    return selectedStyles[value];
  }
  return styles.selectedOption;
};

const getSelectedTextStyle = (selectedTextStyle) => {
  if (selectedTextStyle) {
    return selectedTextStyle;
  }
  return styles.selectedOptionText;
};

const renderOptions = (options, value, onSelect, textStyle,
                       selectedStyles, selectedStyle, selectedTextStyle) => (
  options.map((option, index) => {
    const styleSelected = index === value ?
      getSelectedStyle(options, value, selectedStyles, selectedStyle) : null;
    const styleSelectedText = index === value ?
      getSelectedTextStyle(selectedTextStyle) : null;

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onSelect(index)}
        key={index}
        activeOpacity={1}
      >
        <View style={[styles.option, styleSelected]}>
          {option.icon && option.icon}
          <LabelText
            style={[styles.optionText, textStyle, styleSelectedText]}
            fontSize={13}
          >{option.text}</LabelText>
        </View>
      </TouchableOpacity>
    );
  })
);

export function ToggleButton({
  style,
  trackStyle,
  options,
  value,
  onSelect,
  textStyle,
  selectedStyles,
  selectedStyle,
  selectedTextStyle
}) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.track, trackStyle]}>
        {renderOptions(options, value, onSelect, textStyle,
          selectedStyles, selectedStyle, selectedTextStyle)}
      </View>
    </View>
  );
}

ToggleButton.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
  selectedStyles: PropTypes.array,
  trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  selectedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  selectedTextStyle: PropTypes.object
};
