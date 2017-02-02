import React, { PropTypes } from 'react';
import { View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ActionButton } from 'AppButtons';
import { AuxText } from 'AppFonts';
import { WHITE } from 'AppColors';
import { styles } from '../styles';
import { WINDOW_WIDTH } from 'AppConstants';

export function FindFriendsMethod({ searchContacts, connectToFacebook }) {
  return (
    <View style={styles.container}>

          <AuxText
            upperCase={false}
            style={[
              { textAlign: 'center', color: WHITE, marginTop: 20 },
              styles.transparent
            ]}
          >
            Final Step!
          </AuxText>
          <Image
            source={require('img/icons/signup/icon_signup_find_friends.png')}
            style={styles.findFriendsImage}
            resizeMode={'contain'}
          />
          <AuxText
            upperCase={false}
            style={[styles.findFriendsText, styles.transparent]}
          >
            Find Your Friends
          </AuxText>
          <AuxText
            upperCase={false}
            style={[styles.findFriendsSubText, styles.transparent]}
          >
            JusHive is always better with friends!
          </AuxText>
        <View style={styles.space} />
        <ActionButton
          label={
            <View style={[styles.row, styles.alignMiddle]}>
              <Icon
                name="search"
                size={20}
                color={WHITE}
                style={[
                  styles.icon,
                  { color: WHITE }
                ]}
              />
              <AuxText
                upperCase={false}
                style={styles.lightText}
              >
                Search My Contacts
              </AuxText>
            </View>
          }
          isActive={true}
          onPress={searchContacts}
          labelStyle={styles.lightText}
          style={[
            styles.space,
            styles.loginButton,
            styles.searchContactsBtn
          ]}
        />
        <AuxText
          style={[
            styles.space,
            styles.transparent,
            { color: WHITE }
          ]}
          upperCase={false}
        >
          or
        </AuxText>
        <ActionButton
          isActive={true}
          onPress={connectToFacebook}
          style={[
            styles.space,
            styles.loginButton,
            styles.findFriendsConnectFacebook
          ]}
          labelStyle={styles.lightText}
          label={
          <View style={[styles.row, styles.alignMiddle]}>
            <Icon
              name="facebook-official"
              size={20}
              color={WHITE}
              style={[
                styles.icon,
                { color: WHITE }
              ]}
            />
            <AuxText
              upperCase={false}
              style={styles.lightText}
            >
              CONNECT TO FACEBOOK
            </AuxText>
          </View>
        }
        />
    </View>
  );
}

FindFriendsMethod.propTypes = {
  searchContacts: PropTypes.func,
  connectToFacebook: PropTypes.func,
  skipToNext: PropTypes.func,
};
