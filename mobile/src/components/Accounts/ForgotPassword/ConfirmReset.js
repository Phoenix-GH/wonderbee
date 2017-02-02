import React, { PropTypes } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AuxText } from 'AppFonts';
import { styles } from '../styles';
import { WHITE, GREEN } from 'AppColors';
import { NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function ConfirmReset({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={[styles.adjustTop, styles.top, { marginTop: NAVBAR_HEIGHT }]}>
        <View style={[styles.space, styles.alignMiddle, { marginLeft: 50, marginRight: 50}]}>
          <AuxText upperCase={false} style={[styles.alertLabel, styles.space, styles.transparent]}>
            Success!
          </AuxText>
          <View style={[{alignItems: 'center', marginTop: 20, marginBottom: 20 }, ]} >
            <Icon
              name={'check'}
              size={WINDOW_WIDTH / 2}
              color={GREEN}
              style={styles.transparent}
            />
          </View>
          <AuxText
            style={[{ textAlign: 'center', color: WHITE }, styles.transparent]}
            upperCase={false}
          >
            A new password has been sent to your email or mobile number.
          </AuxText>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.inputWrapper} >
          <AuxText upperCase={false} style={[styles.lightText, styles.bold, styles.transparent, { marginBottom: 3 }]}>
            Back to Login Page
          </AuxText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

ConfirmReset.propTypes = {
  onBack: PropTypes.func.isRequired,
};
