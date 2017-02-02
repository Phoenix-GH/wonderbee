import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextSemiBold, TextRegular } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { BLUE, WHITE, LIGHT_GRAY, HUE_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 5,
    backgroundColor: LIGHT_GRAY,
    borderBottomColor: HUE_GRAY,
    borderBottomWidth: 0.5,
  },
  label: {
    flex: 1,
    maxWidth: WINDOW_WIDTH / 2,
    overflow: 'hidden',
    flexWrap: 'nowrap',
    maxHeight: 50
  },
  row: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 7,
    overflow: 'hidden'
  },
  buttonView: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: BLUE,
  },
  selectedText: {
    color: WHITE
  },
  colBorder: {
    borderLeftWidth: 1,
    borderLeftColor: LIGHT_GRAY
  }
});

const renderButtons = ({ options, selected, onChange }) => (
  options.map((option, i) => (
    <TouchableOpacity
      style={[
        styles.buttonView,
        selected === option ? styles.selected : {},
        i !== 0 ? styles.colBorder : {}
      ]}
      onPress={() => onChange(option)}
      key={i}
    >
      <TextRegular
        style={[selected === option ? styles.selectedText : {}]}
      >
        {option}
      </TextRegular>
    </TouchableOpacity>
  ))
);

export const SettingItemWithChoices = ({
  options,
  label,
  onChange,
  selected
}) => (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextSemiBold style={styles.label}>{label}</TextSemiBold>
        <View style={styles.buttons}>
          {renderButtons({ options, selected, onChange })}
        </View>
      </View>
    </View>
);

SettingItemWithChoices.propTypes = {
  options: PropTypes.array,
  selected: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

SettingItemWithChoices.defaultProps = {
  options: [],
  onChange: () => void(0)
};
