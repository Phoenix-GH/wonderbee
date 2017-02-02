import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { GrayHeader } from 'AppFonts';
import { ActionButton } from 'AppButtons';
import { SECONDARY_TEXT } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: 10,
  },
  text: {
    color: SECONDARY_TEXT,
  },
  bold: {
    fontFamily: 'Panton-bold'
  },
});

export function EmptyFeedAction({ goToHive, style }) {
  return (
    <View style={[styles.container, style && style.style]}>
      <GrayHeader style={[styles.text, styles.marginBottom]}>
        Or create your first Colony
      </GrayHeader>
      <ActionButton
        onPress={goToHive}
        label="Go to the Hive"
        labelStyle={[styles.text, styles.bold]}
      />
    </View>
  );
}

EmptyFeedAction.propTypes = {
  goToHive: PropTypes.func.isRequired,
  style: View.propTypes.style,
};
