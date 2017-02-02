import React, { Component, PropTypes } from 'react';
import { View, Alert, Text } from 'react-native';
import immutableUpdate from 'react-addons-update';
import DeviceInfo from 'react-native-device-info';
import { SimpleTopNav, SettingList, SettingItem, SettingHeader } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { USER_SERVICE, GEOLOCATION_SERVICE } from 'AppServices';
import { styles } from './styles';
import { AlertMessage } from 'AppUtilities';
import { WHITE, BLUE, DARK_GRAY, SECONDARY_TEXT } from 'AppColors';

import Geolocation from 'react-native/Libraries/Geolocation/Geolocation';

class SettingContainer extends Component {
  static propTypes = {
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    resetRouteStack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      picker: {
        focusedOption: '',
        visible: false,
        data: [],
        selected: null,
        title: ''
      },
      ...this.props.feathers.get('user'),
      nearbyPosts: false,
    };

    this.pushNotificationOptions = {
      follow_request: [true, false, 'following'],
      colony_copy: [true, false, 'following'],
      pin: [true, false, 'following'],
      feedback: [true, false, 'following'],
      direct_message: [true, false, 'following'],
      comment: [true, false, 'following'],
      reply: [true, false, 'following'],
      group_message: [true, false],
      mutual_friend: [true, false],
    };
    this.onValueChange = ::this.onValueChange;
    this.onDisplayLocationChanged = ::this.onDisplayLocationChanged;
    this.logout = ::this.logout;
  }

  onDisplayLocationChanged() {
    const { feathers } = this.props;
    const { displayLocation } = this.state;
    const geolocationService = feathers.service(GEOLOCATION_SERVICE);
    const userService = feathers.service(USER_SERVICE);
    const user = feathers.get('user');
    let locationQuery = {};
    const query = {
      types: 'current'
    };
    // location display we should just toggle
    if (displayLocation) {
      return userService.patch(user.id, { displayLocation: false })
        .then(() => this.setState({ displayLocation: false }))
        .then(() => feathers.set('user', { ...user, displayLocation: false }))
        .catch(err => AlertMessage.fromRequest(err));
    }

    return Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        query.latitude = latitude;
        query.longitude = longitude;
        return geolocationService.find({ query })
          .then(({ geometry, formatted_address }) => {
            locationQuery = {
              name: formatted_address,
              latitude: geometry.location.lat,
              longitude: geometry.location.lng
            };
            return userService.patch(user.id, {
              location: locationQuery,
              displayLocation: true
            });
          })
          .then((updatedUser) => {
            feathers.set('user', {
              ...user,
              ...updatedUser,
              location: locationQuery
            });
            this.setState({
              location: locationQuery,
              displayLocation: true
            });
          })
          .catch(err => AlertMessage.fromRequest(err));
      },
      (err) => AlertMessage.fromRequest(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
    );
  }

  onValueChange(value, field, settingsType = 'notificationSettings') {
    const { feathers } = this.props;
    const updateSetting = !!settingsType ? {
      [settingsType]: immutableUpdate(this.state[settingsType], { $merge: { [field]: value } })
    } : {
      [field]: value
    };

    this.setState(updateSetting);
    feathers.service(USER_SERVICE).patch(null, updateSetting)
      .catch(error => AlertMessage.fromRequest(error));
  }

  onPrivacyChange(isPrivate) {
    const alertText = isPrivate ? 'Only followers will see your posts and ' +
    'new followers will need your approval.' :
    'Anyone will be able to see your posts and you will no longer need to approve followers.';

    Alert.alert(
      null,
      alertText,
      [
        { text: 'Ok', onPress: () => this.onValueChange(isPrivate, 'private', null) },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' }
      ]
    );
  }

  logout() {
    const { feathers, resetRouteStack } = this.props;
    resetRouteStack(0, { logout: true });
    feathers.logout();
  }

  render() {
    const { routeScene, routeBack } = this.props;
    const { location } = this.state;
    const locationText = !location ?
      '' :
      location.name ||
      [location.city, location.state].filter(str => !!str).join(', ');

    const version = DeviceInfo.getVersion();

    return (
      <View style={[styles.container]}>
        <SimpleTopNav
          leftAction={routeBack}
          centerLabel="SETTINGS"
          iconBack={true}
          color={WHITE}
        />
        <SettingList>
          <SettingHeader label="Account" />
          <SettingItem
            label="Edit Profile"
            onPress={() => routeScene('ProfileEditScene')}
          />
          <SettingItem
            label="Change Password"
            onPress={() => routeScene('ChangePasswordScene')}
          />
          <SettingItem
            label="Email & Phone Number"
            onPress={() => routeScene('UpdateEmailAndPhoneScene')}
          />
          <SettingItem
            label="Linked Accounts"
            onPress={() => routeScene('LinkedAccountsScene')}
          />
          <SettingHeader label="Privacy" />
          <SettingItem
            label="Display Location"
            switchItem={true}
            showAdditionalText={true}
            additionalTextColor={this.state.displayLocation ? DARK_GRAY : SECONDARY_TEXT}
            additionalText={locationText}
            onValueChange={() => this.onDisplayLocationChanged()}
            switchValue={this.state.displayLocation}
          />
          <SettingItem
            label="Nearby Posts"
            switchItem={true}
            onValueChange={() => this.setState({ nearbyPosts: !this.state.nearbyPosts })}
            switchValue={this.state.nearbyPosts}
          />
          <SettingItem
            label="Private Account"
            switchItem={true}
            onValueChange={() => this.onPrivacyChange(!this.state.private)}
            switchValue={this.state.private}
          />
          <SettingHeader label="Follow People" />
          <SettingItem
            label="Find Facebook Friends"
            onPress={() => routeScene('SearchContactsScene', {
              shouldGoBack: true,
              source: 'facebook',
            })}
          />
          <SettingItem
            label="Find Contacts"
            onPress={() => routeScene('SearchContactsScene', { shouldGoBack: true })}
          />
          <SettingItem label="Invite Your Friends" />
          <SettingHeader label="General" />
          <SettingItem label="Text Size" />
          <SettingItem
            label="Push Notifications"
            onPress={() => routeScene('PushNotificationOptionsScene')}
          />
          <SettingItem label="Logout" onPress={this.logout} />
          <View style={{ padding: 10 }}>
              <Text style={{ color: SECONDARY_TEXT }}>Version {version}</Text>
          </View>
        </SettingList>
      </View>
    );
  }
}

export default connectFeathers(SettingContainer);
