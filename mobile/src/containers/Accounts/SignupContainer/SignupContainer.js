import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import { Signup, FillProfile } from 'AppComponents';
import { styles } from '../styles';
import { connectFeathers } from 'AppConnectors';
import { AlertMessage, PushNotification } from 'AppUtilities';
import { USER_SERVICE, GEOLOCATION_SERVICE } from 'AppServices';
import { WHITE } from 'AppColors';
import { AuxText } from 'AppFonts';
import Geolocation from 'react-native/Libraries/Geolocation/Geolocation';

const signupSteps = {
  first: 'username/password',
  second: 'details'
};

class SignupContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    facebookData: PropTypes.object,
    email: PropTypes.string,
    phone: PropTypes.shape({
      number: PropTypes.string.isRequired,
      dialCode: PropTypes.string.isRequired
    }),
    onSuccess: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      step: signupSteps.first,
      avatarUrl: props.facebookData && props.facebookData.avatarUrl || '',
      location: null
    };
    this.handleSignup = ::this.handleSignup;
    this.renderSignupContent = ::this.renderSignupContent;
    this.routeToAvatarPick = ::this.routeToAvatarPick;
    this.onAvatarSave = ::this.onAvatarSave;
    this.removeProfilePic = ::this.removeProfilePic;
    this.getUserLocation = ::this.getUserLocation;
  }

  onAvatarSave(avatarUrl) {
    this.setState({ avatarUrl });
  }

  getUserLocation() {
    const { feathers } = this.props;
    const geolocationService = feathers.service(GEOLOCATION_SERVICE);
    const userService = feathers.service(USER_SERVICE);
    const user = feathers.get('user');
    const userId = user.id;
    const query = {
      types: 'current'
    };

    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        query.latitude = latitude;
        query.longitude = longitude;
        return geolocationService.find({ query })
          .then(({ geometry, formatted_address }) => {
            const location = {
              name: formatted_address,
              latitude: geometry.location.lat,
              longitude: geometry.location.lng
            };
            userService.patch(userId, { location })
              .then(({ locationId }) => feathers.set('user', { ...user, location, locationId }));
          })
          .catch(err => AlertMessage.fromRequest(err));
      },
      (err) => AlertMessage.fromRequest(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
    );
  }

  routeToAvatarPick() {
    this.props.routeScene('AvatarCameraScene', { onAvatarSave: this.onAvatarSave });
  }

  removeProfilePic() {
    this.setState({ avatarUrl: '' });
  }

  handleSignup(data) {
    const {
      feathers,
      onSuccess,
      facebookData,
      email,
      phone = {},
      onLoginSuccess
    } = this.props;
    if (!data) {
      return onSuccess();
    }
    const { username, password } = data;
    const user = Object.assign({}, data, {
      email,
      phone: phone.number,
      dialCode: phone.dialCode
    }, facebookData);
    const userService = feathers.service(USER_SERVICE);

    if (this.state.step === signupSteps.first) {
      return userService.create(user)
        .then(() => feathers.authenticate({ type: 'local', username, password }))
        .then(() => PushNotification.requestPermission())
        .then(() => {
          onLoginSuccess();
          this.getUserLocation();
          LayoutAnimation.easeInEaseOut();
          return this.setState({
            step: signupSteps.second,
          });
        })
        .catch(error => {
          AlertMessage.showMessage(error.message, ' ');
        });
    }
    const userId = feathers.get('user').id;
    const patchData = {
      ...data,
      avatarUrl: this.state.avatarUrl,
      location: this.state.location
    };
    return userService.patch(userId, patchData)
      .then((updatedUser) => {
        feathers.set('user', {
          ...user,
          ...updatedUser,
          location: this.state.location
        });
      })
      .then(() => onSuccess())
      .catch(err => AlertMessage.fromRequest(err));
  }

  renderSignupContent() {
    const { step, avatarUrl } = this.state;
    const { feathers, facebookData, email, phone, onBack } = this.props;
    let renderContent = null;
    switch (step) {
      case signupSteps.first:
        renderContent = (
          <View style={[styles.container, { alignItems: 'center' }]}>
            <View style={styles.logo} >
              <Image
                source={require('img/icons/signup/icon_signup_user.png')}
                style={[styles.loginIcon]}
              />
              <AuxText
                upperCase={false}
                style={[
                  styles.containerLabel,
                  styles.space,
                  styles.transparent,
                  { color: WHITE, marginTop: 5 }
                ]}
              >
                Create your account
              </AuxText>
            </View>
            <Signup
              feathers={feathers}
              handleSignup={this.handleSignup}
              facebookData={facebookData}
              email={email}
              phone={phone}
              onBack={onBack}
            />
            <TouchableOpacity onPress={onBack} style={[styles.backButton]} >
              <Text style={[styles.lightText, styles.bold]}>back</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case signupSteps.second:
        renderContent = (
          <View>
            <FillProfile
              facebookData={facebookData}
              handleSignup={this.handleSignup}
              onPickAvatar={this.routeToAvatarPick}
              onRemoveAvatar={this.removeProfilePic}
              avatarUrl={avatarUrl}
              feathers={feathers}
            />
          </View>
        );
        break;
      default:
    }

    return renderContent;
  }

  render() {
    return (
      <View style={styles.wrapper}>
        {this.renderSignupContent()}
      </View>
    );
  }
}

export default connectFeathers(SignupContainer);
