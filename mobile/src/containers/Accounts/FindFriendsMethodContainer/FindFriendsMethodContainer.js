import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FindFriendsMethod } from 'AppComponents';
import { styles } from '../styles';

export const FindFriendsMethodContainer = ({
  skip,
  connectToFacebook,
  searchContacts,
  onBack
}) => (
  <View style={styles.wrapper}>
    <FindFriendsMethod
      searchContacts={searchContacts}
      connectToFacebook={connectToFacebook}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
      <TouchableOpacity onPress={onBack} style={[styles.backButton]} >
        <Text style={[styles.lightText, styles.bold]}>back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={skip} style={[styles.backButton, { marginRight: 25 }]} >
        <Text style={[styles.lightText, styles.bold]}>skip</Text>
      </TouchableOpacity>
    </View>
  </View>
);

FindFriendsMethodContainer.propTypes = {
  skip: PropTypes.func.isRequired,
  connectToFacebook: PropTypes.func.isRequired,
  searchContacts: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
