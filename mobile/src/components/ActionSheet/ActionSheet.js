import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { ActionButton } from 'AppButtons';
import { styles } from './styles';

export function ActionSheet({ options, callback, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonsBox}>
        {options.map((btn, i) =>
          <ActionButton
            key={i}
            isActive={true}
            onPress={() => callback(i)}
            style={[styles.button, i === options.length - 1 ? styles.cancel : {}]}
            labelStyle={styles.buttonLabel}
            {...btn}
          />
        )}
      </View>
    </View>
  );
}

ActionSheet.propTypes = {
  options: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  style: View.propTypes.style
};

ActionSheet.defaultProps = {
  options: [],
  callback: null
};
