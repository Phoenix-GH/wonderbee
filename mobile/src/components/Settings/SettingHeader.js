import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { HorizontalRuler } from 'AppComponents';
import { WHITE } from 'AppColors';
import { TextBold } from 'AppFonts';

const height = 50;
const padding = height / 5;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding,
    height,
    marginTop: padding * 2,
    backgroundColor: WHITE,
  },
  settingTitle: {
    fontSize: 16
  }
});

export function SettingHeader({ label }) {
  return (
    <View>
      <View style={styles.row}>
        <TextBold style={styles.settingTitle}>{label.toUpperCase()}</TextBold>
      </View>
      <HorizontalRuler />
    </View>
  );
}

SettingHeader.propTypes = {
  label: PropTypes.string.isRequired,
};
