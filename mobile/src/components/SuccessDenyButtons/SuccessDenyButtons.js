import React, { PropTypes } from 'react';
import { View, Image } from 'react-native';
import { FlexButton } from 'AppButtons';
import { styles } from './styles';

export function SuccessDenyButtons({ onSuccess, onDeny }) {
  return (
    <View style={styles.simpleRow}>
      <FlexButton
        label={
          <Image
            source={require('img/icons/icon_cancel.png')}
            style={[styles.image, styles.leftButton]}
          />
        }
        onPress={onDeny}
        style={styles.leftButton}
      />
      <FlexButton
        label={
          <Image
            source={require('img/icons/icon_check_vote.png')}
            style={styles.image}
          />
        }
        onPress={onSuccess}
        style={styles.rightButton}
      />
    </View>
  );
}

SuccessDenyButtons.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
};
