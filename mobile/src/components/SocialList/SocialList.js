/**
 * Created by nick on 18/07/16.
 */
import React, { PropTypes } from 'react';
import { View, TouchableOpacity, ListView, Image } from 'react-native';
import { styles } from './styles';
import { SOCIAL_ITEMS } from 'AppConstants';
import { LabelText } from 'AppFonts';

const renderSocialRow = (social, onPress) => (
  <TouchableOpacity style={styles.socialContainer} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image source={social.icon} style={social.style} />
    </View>
    <LabelText style={styles.socialLabel}>{social.name}</LabelText>
  </TouchableOpacity>
);

export const SocialList = ({ onPress, style }) => {
  const socialDataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  });
  const socialRows = socialDataSource.cloneWithRows(SOCIAL_ITEMS);
  return (
    <View style={[styles.socialListContainer, style]}>
      <ListView
        enableEmptySections={true}
        horizontal={true}
        dataSource={socialRows}
        renderRow={(item) => renderSocialRow(item, onPress)}
      />
    </View>
  );
};

SocialList.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any
};
