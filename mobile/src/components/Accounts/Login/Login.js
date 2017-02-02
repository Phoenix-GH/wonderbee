import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import { ActionButton } from 'AppButtons';
import { AuxText } from 'AppFonts';
import { SECONDARY_TEXT, WHITE, BLACK, GRAY, DARK_GRAY } from 'AppColors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { dismissKeyboard, AlertMessage } from 'AppUtilities';
import { styles } from '../styles';

export class Login extends Component {
  static propTypes = {
    routeForgotPassword: PropTypes.func.isRequired,
    routeSignup: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
    signupWithFacebook: PropTypes.func.isRequired,
    onFacebookModal: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    handleFacebookCancel: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      username: '',
      password: '',
    };
    this.changeUsername = ::this.changeUsername;
    this.changePassword = ::this.changePassword;
    this.handleSubmit = ::this.handleSubmit;
  }
  componentWillMount() {
    const { io } = this.props.feathers;
    const { signupWithFacebook, handleFacebookCancel } = this.props;

    io.on('fb:gettingUserData', () => {
      handleFacebookCancel();
    });
    io.on('fb:userData', (data) => {
      /**
       * @deprecated
       *
       * In the future this check should be moved to backend,
       * and in case of error
       * backend should emit fb:error event
       * */
      if (!!data.error) {
        return AlertMessage.fromRequest(data.error);
      }
      return signupWithFacebook(data);
    });
    io.on('fb:error', (err) => {
      handleFacebookCancel();
      AlertMessage.fromRequest(err);
    });
  }
  changeUsername(username) {
    this.setState({ username });
  }

  changePassword(password) {
    this.setState({ password });
  }

  handleSubmit() {
    const { username, password } = this.state;
    const { handleLogin } = this.props;

    handleLogin({ username, password });
  }

  render() {
    const { username, password } = this.state;
    const { routeForgotPassword, routeSignup, onFacebookModal } = this.props;
    const isActive = !!username && !!password;
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>
            <Image
              source={require('img/icons/signup/icon_signup_logo.png')}
              style={styles.logo}
            />
          <View style={styles.top}>
            <View style={[styles.space, { flexDirection: 'row' }]} >
              <Image
                source={require('img/icons/signup/icon_signup_password.png')}
                style={[styles.loginIcon]}
                resizeMode={'contain'}
              />
              <View style={[styles.inputWrapper, { marginLeft: 10 }]}>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="username"
                  onChangeText={this.changeUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholderTextColor={WHITE}
                  value={username}
                />
              </View>
            </View>
            <View style={[styles.space, { flexDirection: 'row' }]}>
              <Image
                source={require('img/icons/signup/icon_signup_user.png')}
                style={[styles.loginIcon]}
                resizeMode={'contain'}
              />
              <View style={[styles.inputWrapper, { marginLeft: 10 }]} >
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="password"
                  onChangeText={this.changePassword}
                  clearButtonMode="while-editing"
                  secureTextEntry={true}
                  placeholderTextColor={WHITE}
                  value={password}
                />
              </View>
            </View>
            <ActionButton
              label="Log In"
              upperCase={false}
              labelStyle={{ color }}
              isActive = {isActive}
              onPress={this.handleSubmit}
              style={[styles.space, styles.loginButton, { backgroundColor, borderColor: backgroundColor }]}
            />
            <TouchableOpacity onPress={routeForgotPassword} style={styles.space}>
              <AuxText
                upperCase={false}
                style={[styles.lightText, styles.bold]}
              >
                Log In Help
              </AuxText>
            </TouchableOpacity>
          </View>
          <View style={styles.signupButtonContainer}>
            <ActionButton
              label="Sign Up"
              labelStyle={{ color: WHITE }}
              isActive = {true}
              onPress={routeSignup}
              upperCase={false}
              style={[styles.space, styles.signupButton]}
            />
          </View>
          <View style={[styles.bottom, styles.transparentBackground, styles.spaceAround]}>
              <TouchableOpacity onPress={onFacebookModal} style={[{ paddingBottom: 3, flexDirection: 'row' }]} >
                <Icon
                  name={'facebook'}
                  color={WHITE}
                  style={{ marginRight: 5 }}
                  size={18}
                />
                <View style={styles.inputWrapper}>
                  <AuxText
                    upperCase={false}
                    style={[styles.lightText, { paddingBottom: 5 }, styles.textSmallSize]}
                  >
                    Sign up with facebook
                  </AuxText>
                </View>
              </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[{ paddingBottom: 3, flexDirection: 'row' }]}
            >
              <Icon
                name={'google'}
                color={WHITE}
                style={{ marginRight: 5 }}
                size={18}
              />
              <View style={styles.inputWrapper}>
                <AuxText
                  upperCase={false}
                  style={[styles.lightText, { paddingBottom: 5 }, styles.textSmallSize]}
                >
                  Sign up with Google
                </AuxText>
              </View>
            </TouchableOpacity>
           </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
