import React, { PropTypes } from 'react';
import { Text, View, Image } from 'react-native';
import { Close } from 'AppComponents';
import { styles } from './styles';

export const HiveWelcomeModal = ({ visible = true, onClose }) => (
  visible ? (
  <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.closeView}>
        <Close style={styles.close} close={onClose} />
      </View>
      <Image source={require('img/icons/icon_logo.png')} style={styles.logo} />
      <Text style={styles.welcome}>WELCOME TO THE HIVE</Text>
      <Text style={[styles.text, styles.marginBottom]}>Scroll up to see what's trending.</Text>
      <Text style={styles.text}>Use the plus icon to create custom</Text>
      <Text style={styles.text}>honeycombs from friends, groups,</Text>
      <Text style={styles.text}>locations and keywords</Text>
    </View>
  </View>
  ) : null
);

HiveWelcomeModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

