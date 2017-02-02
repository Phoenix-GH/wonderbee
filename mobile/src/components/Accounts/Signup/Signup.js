import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { GUEST_SERVICE, CLIENT_TOKEN } from 'AppServices';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { dismissKeyboard } from 'AppUtilities';
import { ActionButton } from 'AppButtons';
import { VALID_TEXT, INVALID_TEXT, BLACK, WHITE, DARK_GRAY, GRAY } from 'AppColors';
import { styles } from '../styles';

class Signup extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    handleSignup: PropTypes.func.isRequired,
    facebookData: PropTypes.object,
    email: PropTypes.string,
    phone: PropTypes.shape({
      number: PropTypes.string.isRequired,
      dialCode: PropTypes.string.isRequired
    }),
    scrollHeight: PropTypes.number,
    onBack: PropTypes.func.isRequired,
  };

  static defaultProps = {
    facebookData: {}
  };

  constructor(props, context) {
    super(props, context);

    const phone = props.phone ? { phone: props.phone } : {};
    const email = props.email ? { email: props.email } : {};

    this.state = Object.assign({}, {
      username: '',
      usernameValidated: false,
      usernameError: '',
      password: '',
      passwordValidated: false,
      passwordError: '',
    }, props.facebookData, phone, email);

    this.changeUsername = ::this.changeUsername;
    this.validateUsername = ::this.validateUsername;
    this.changePassword = ::this.changePassword;
    this.validatePassword = ::this.validatePassword;
    this.handleSubmit = ::this.handleSubmit;
    this.isFormValid = ::this.isFormValid;
    this.setLocation = ::this.setLocation;
  }

  setLocation({ result }) {
    const { formatted_address, geometry } = result;
    const { lat: latitude, lng: longitude } = geometry.location;

    const location = {
      name: formatted_address,
      latitude,
      longitude
    };
    this.setState({ location });
  }

  changeUsername(username) {
    if (username.length > 30) {
      this.setState({
        usernameValidated: true,
        usernameError: 'username must be less than 31 characters'
      });
      return;
    }
    this.setState({ username, usernameValidated: false });
  }

  validateUsername() {
    const { username } = this.state;
    const { feathers } = this.props;
    const guestsService = feathers.service(GUEST_SERVICE);
    const isCharacterInvalid = /[^a-z_A-Z0-9]/;
    if (!username) {
      return this.setState({
        usernameValidated: true,
        usernameError: 'username must not be empty'
      });
    }
    if (isCharacterInvalid.test(username)) {
      return this.setState({
        usernameValidated: true,
        usernameError: 'Invalid characters'
      });
    }
    const request = {
      token: CLIENT_TOKEN,
      requestType: 'checkUnique',
      model: 'users',
      checkValues: {
        username,
      },
    };
    return guestsService.create(request)
      .then(result => (
        this.setState({
          usernameValidated: true,
          usernameError: result ? 'username is already taken' : null
        })
      ))
      .catch(error => this.setState({ usernameValidated: true, usernameError: error }));
  }

  changePassword(password) {
    this.setState({ password, passwordValidated: false });
  }

  validatePassword() {
    let passwordError = null;
    if (this.state.password.length < 5) {
      passwordError = 'password must be 5 characters or more';
    }
    this.setState({ passwordValidated: true, passwordError });
  }

  isFormValid() {
    const {
      usernameValidated, usernameError,
      passwordValidated, passwordError,
    } = this.state;
    return (usernameValidated && !usernameError) &&
      (passwordValidated && !passwordError);
  }

  handleSubmit() {
    const {
      username,
      password,
    } = this.state;
    const { handleSignup } = this.props;
    const userData = { username, password };
    handleSignup(userData);
  }

  render() {
    const {
      username, usernameValidated, usernameError,
      password, passwordValidated, passwordError,
    } = this.state;
    const isActive = this.isFormValid();
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
        <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
          <View style={styles.container}>
            <View style={styles.space} />
            <View style={[styles.space, styles.row]}>
              <View style={[styles.space, { flexDirection: 'row' }]} >
                <Image
                  source={require('img/icons/signup/icon_signup_user.png')}
                  style={[styles.loginIcon]}
                />
                <View style={[styles.inputWrapper, { marginLeft: 10 }]}>
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="username"
                    placeholderTextColor={WHITE}
                    returnKeyType="done"
                    onChangeText={this.changeUsername}
                    onEndEditing={this.validateUsername}
                    value={username}
                  />
                </View>
              </View>
              {usernameValidated &&
              <Icon
                name={usernameError ? 'close' : 'check'}
                size={25}
                color={usernameError ? INVALID_TEXT : VALID_TEXT}
                style={[styles.floatRight, styles.transparent]}
              />
              }
              {usernameValidated && usernameError &&
              <Text style={[styles.errorText, styles.floatRight, styles.transparent]}>
                {usernameError}
              </Text>
              }
            </View>
            <View style={[styles.space, styles.row]}>
              <View style={[styles.space, { flexDirection: 'row' }]}>
                <Image
                  source={require('img/icons/signup/icon_signup_password.png')}
                  style={[styles.loginIcon]}
                />
                <View style={[styles.inputWrapper, { marginLeft: 10 }]} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    secureTextEntry={true}
                    placeholder="password"
                    placeholderTextColor={WHITE}
                    returnKeyType="done"
                    onChangeText={this.changePassword}
                    onEndEditing={this.validatePassword}
                    value={password}
                  />
                </View>
              </View>
              {passwordValidated &&
              <Icon
                name={passwordError ? 'close' : 'check'}
                size={25}
                color={passwordError ? INVALID_TEXT : VALID_TEXT}
                style={[styles.floatRight, styles.transparent]}
              />
              }
              {passwordValidated && passwordError &&
              <Text style={[styles.errorText, styles.floatRight, styles.transparent]}>
                {passwordError}
              </Text>
              }
            </View>
            <View style={styles.bottomContainer}>
              <ActionButton
                label="Create Account"
                upperCase={false}
                isActive={isActive}
                onPress={this.handleSubmit}
                labelStyle={{ color }}
                style={[
                  styles.space,
                  styles.loginButton,
                  { backgroundColor, borderColor: backgroundColor }
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
    );
  }
}

export default connectFeathers(Signup);
