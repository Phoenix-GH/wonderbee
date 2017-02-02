import React from 'react';
import { View } from 'react-native';
import { GoldHeader } from 'AppFonts';
import { styles } from './styles';

export const WelcomeBanner = () => (
  <View style={styles.container}>
    <GoldHeader>JustHive</GoldHeader>
  </View>
);
