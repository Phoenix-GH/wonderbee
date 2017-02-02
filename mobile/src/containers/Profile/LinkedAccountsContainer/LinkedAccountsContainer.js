import React, { Component, PropTypes } from 'react';
import { View, Alert } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { AlertMessage, emptyFunction } from 'AppUtilities';
import { USER_SERVICE } from 'AppServices';
import { BLUE, WHITE } from 'AppColors';
import {
  SettingItem,
  SettingList,
  SimpleTopNav,
  FacebookModal
} from 'AppComponents';
import { styles } from './styles';

class LinkedAccountsContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    const { feathers } = props;
    this.state = {
      ...feathers.get('user'),
      facebookConnected: !!feathers.get('user').facebookOAuthToken,
      connectFacebook: false
    };
    this.toggleFacebook = ::this.toggleFacebook;
    this.connectFacebook = ::this.connectFacebook;
    this.disconnectFacebook = ::this.disconnectFacebook;
  }

  componentWillMount() {
    const { io } = this.props.feathers;
    io.on('fb:gettingUserData', () => {
      this.setState({ connectFacebook: false });
    });
    io.on('fb:error', (err) => {
      this.setState({ connectFacebook: false });
      AlertMessage.fromRequest(err);
    });
    io.on('fb:userData', (user) => {
      if (!!user.error) {
        return AlertMessage.fromRequest(user.error);
      }
      const userService = this.props.feathers.service(USER_SERVICE);
      const patch = {
        facebookUserId: user.id,
        facebookOAuthToken: user.token.accessToken,
        facebookOAuthTokenExpiresAt: user.token.expiresAt,
      };

      return userService.patch(this.props.feathers.get('user').id, patch)
        .then(() => (
          this.setState({
            ...this.props.feathers.get('user'),
            facebookConnected: true,
          })
        ));
    });
  }

  componentWillUnmount() {
    const { io } = this.props.feathers;
    io.removeListener('fb:userData');
    io.removeListener('fb:gettingUserData');
    io.removeListener('fb:error');
  }

  connectFacebook() {
    this.setState({
      connectFacebook: true
    });
  }

  disconnectFacebook() {
    const { feathers } = this.props;
    const userService = feathers.service(USER_SERVICE);
    const userId = feathers.get('user').id;
    const patch = {
      facebookUserId: null,
      facebookOAuthToken: null,
      facebookOAuthTokenExpiresAt: null,
    };
    return userService.patch(userId, patch)
      .then(() => (
        this.setState({
          ...feathers.get('user'),
          facebookConnected: false
        })
      ))
      .catch(err => AlertMessage.fromRequest(err));
  }

  toggleFacebook(val) {
    if (val) {
      return this.connectFacebook();
    }
    const buttons = [
      { text: 'Cancel', onPress: emptyFunction, style: 'cancel' },
      { text: 'OK', onPress: this.disconnectFacebook },
    ];
    return Alert.alert(
      'Warning',
      `You are about to disable all integration
       with Facebook from JustHive`,
      buttons
    );
  }

  render() {
    const { routeBack } = this.props;
    const { facebookConnected, connectFacebook } = this.state;

    return (
      <View style={styles.container}>
        <SimpleTopNav
          leftAction={routeBack}
          centerLabel="Linked Accounts"
          iconBack={true}
          color={WHITE}
        />
        <FacebookModal
          isVisible={connectFacebook}
          onCancel={() => this.setState({ connectFacebook: false })}
        />
        <SettingList>
          <SettingItem
            switchItem={true}
            label={'facebook'}
            textColor={'black'}
            switchValue={facebookConnected}
            onValueChange={this.toggleFacebook}
            additionalText={this.state.username}
          />
        </SettingList>
      </View>
    );
  }
}

export default connectFeathers(LinkedAccountsContainer);
