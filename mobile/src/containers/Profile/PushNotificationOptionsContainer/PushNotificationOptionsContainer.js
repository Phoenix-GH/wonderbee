import React, { Component, PropTypes } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SimpleTopNav, SettingItemWithChoices } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { WHITE, BLUE } from 'AppColors';
import { USER_SERVICE } from 'AppServices';
import { AlertMessage } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

function toLabel(value, onlyOnOff) {
  switch (value) {
    case true:
      if (onlyOnOff) {
        return 'On';
      }
      return 'Everyone';
    case false:
      return 'Off';
    case 'following':
      return 'Following';
    default:
      return null;
  }
}

function toValue(label) {
  switch (label) {
    case 'Everyone':
    case 'On':
      return true;
    case 'Off':
      return false;
    case 'Following':
      return 'following';
    default:
      return null;
  }
}


class PushNotificationOptionsContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...props.feathers.get('user').notificationSettings
    };

    this.keyNames = {
      followRequest: 'Follow Requests',
      colonyCopy: 'Colony Copy',
      pin: 'Pins',
      feedback: 'Feedback',
      directMessage: 'Direct Messages',
      comment: 'Comments',
      reply: 'Replies',
      groupMessage: 'Group Messages',
      mutualFriend: 'Mutual Friends'
    };

    this.pushNotificationOptions = {
      followRequest: [false, 'following', true],
      colonyCopy: [false, 'following', true],
      pin: [false, 'following', true],
      feedback: [false, 'following', true],
      directMessage: [false, 'following', true],
      comment: [false, 'following', true],
      reply: [false, 'following', true],
      groupMessage: [false, true],
      mutualFriend: [false, true],
    };

    this.getPushOptions = ::this.getPushOptions;
    this.onOptionChange = ::this.onOptionChange;
    this.isTwoOptionsOnly = ::this.isTwoOptionsOnly;
  }

  onOptionChange(key, value) {
    const { feathers } = this.props;
    const userService = feathers.service(USER_SERVICE);
    const user = feathers.get('user');
    const notificationSettings = {
      ...this.state,
      [key]: toValue(value)
    };
    userService.patch(user.id, { notificationSettings })
      .then(() => {
        feathers.set('user', {
          ...user,
          notificationSettings
        });
        this.setState({ [key]: toValue(value) });
      })
      .catch((err) => AlertMessage.fromRequest(err));
  }

  getPushOptions(key) {
    const isTwoOptionOnly = this.isTwoOptionsOnly(key);
    return this.pushNotificationOptions[key].map((val) => toLabel(val, isTwoOptionOnly));
  }

  isTwoOptionsOnly(key) {
    return this.pushNotificationOptions[key].length === 2;
  }

  render() {
    const { onBack } = this.props;
    const pushOptions = Object.keys(this.pushNotificationOptions);

    return (
      <View style={styles.container}>
        <SimpleTopNav
          backgroundColor={BLUE}
          color={WHITE}
          centerLabel={'Push Notifications'}
          iconBack={true}
          leftAction={onBack}
        />
        <ScrollView>
          {pushOptions.map((option, index) => (
            <SettingItemWithChoices
              key={index}
              label={this.keyNames[option]}
              selected={toLabel(this.state[option], this.isTwoOptionsOnly(option))}
              options={this.getPushOptions(option)}
              onChange={(val) => this.onOptionChange(option, val)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}


export default connectFeathers(PushNotificationOptionsContainer);
