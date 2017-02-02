import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet, Switch } from 'react-native';
import { TextSemiBold } from 'AppFonts';
import { HorizontalRuler } from 'AppComponents';
import { WINDOW_WIDTH } from 'AppConstants';
import { YELLOW, SECONDARY_TEXT, LIGHT_GRAY } from 'AppColors';

const height = 50;
const padding = height / 5;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding,
    height,
    backgroundColor: LIGHT_GRAY,
  },
  arrow: {
    fontSize: padding * 2.2,
    color: '#B1B1B1',
  },
  settingItem: {
    fontSize: 14
  },
  secondaryText: {
    color: SECONDARY_TEXT,
    marginRight: 10,
    flex: 1,
    flexWrap: 'wrap',
    maxWidth: WINDOW_WIDTH / 3
  }
});

export function SettingItem({
  label,
  onPress,
  switchItem,
  onValueChange,
  switchValue,
  additionalText,
  showAdditionalText,
  additionalTextColor,
  textColor,
}) {
  const shouldShowAdditionalText = !!additionalText && (
    showAdditionalText || switchValue
  );

  return (
    <View>
      {switchItem ? (
        <View style={styles.row}>
          <TextSemiBold
            style={[styles.settingItem, textColor ? { color: textColor } : {}]}
          >
            {label}
          </TextSemiBold>
          <View style={styles.row}>
            {shouldShowAdditionalText && (
              <TextSemiBold
                style={[styles.settingItem, { color: additionalTextColor }]}
                numberOfLines={1}
              >
                {additionalText}
              </TextSemiBold>
            ) }
            <Switch
              onValueChange={onValueChange}
              value={switchValue}
            />
          </View>
        </View>
      ) : (
        <TouchableHighlight onPress={onPress} underlayColor={YELLOW}>
          <View style={styles.row}>
            <TextSemiBold
              style={[styles.settingItem, textColor ? { color: textColor } : {}]}
            >
              {label}
            </TextSemiBold>
            {additionalText ? (
              <TextSemiBold
                style={[styles.settingItem, { color: additionalTextColor }]}
                numberOfLines={1}
              >
                {additionalText}
              </TextSemiBold>
            ) : (
              <TextSemiBold style={[styles.arrow, styles.settingItem]}>></TextSemiBold>
            )}
          </View>
        </TouchableHighlight>
      )}
      <HorizontalRuler />
    </View>
  );
}

SettingItem.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  onValueChange: PropTypes.func,
  switchItem: PropTypes.bool.isRequired,
  switchValue: PropTypes.bool,
  additionalText: PropTypes.string,
  additionalTextColor: PropTypes.string,
  textColor: PropTypes.string,
  showAdditionalText: PropTypes.bool,
};

SettingItem.defaultProps = {
  switchItem: false,
  switchValue: false,
  showAdditionalText: false,
  additionalTextColor: SECONDARY_TEXT,
};
