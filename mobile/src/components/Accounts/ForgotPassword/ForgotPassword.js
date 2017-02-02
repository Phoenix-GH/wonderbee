import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { AuxText } from 'AppFonts';
import { ActionButton } from 'AppButtons';
import { SECONDARY_TEXT, WHITE, DARK_GRAY, GRAY, BLACK } from 'AppColors';
import { NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { dismissKeyboard } from 'AppUtilities';
import { styles } from '../styles';

export class ForgotPassword extends Component {
  static propTypes = {
    handleSendEmail: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      email: ''
    };
    this.changeUsername = ::this.changeUsername;
    this.changeEmail = ::this.changeEmail;
    this.handleSubmit = ::this.handleSubmit;
  }

  changeUsername(username) {
    this.setState({ username });
  }

  changeEmail(email) {
    this.setState({ email });
  }

  handleSubmit() {
    const { username, email } = this.state;
    const { handleSendEmail } = this.props;

    handleSendEmail({ userInfo: username || email });
  }

  render() {
    const { username, email } = this.state;
    const { onBack } = this.props;
    const isActive = !!username || !!email;
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>

          <View style={[styles.adjustTop, styles.top]}>
            <View style={{ alignItems: 'center', }} >
              <Image
                source={require('img/icons/signup/icon_signup_large_password.png')}
                style={[styles.loginIcon, { width: WINDOW_WIDTH / 2, height: WINDOW_WIDTH / 2,}]}
                resizeMode={'contain'}
              />
            </View>
            <View style={[styles.space, styles.alignMiddle, styles.transparent, { marginLeft: 50, marginRight: 50 }]}>
              <AuxText upperCase={false} style={{textAlign: 'center', color: WHITE}} >
                Please enter your Email or mobile number that's on the account
              </AuxText>
            </View>
            <View style={[styles.space, { flexDirection: 'row' }]} >
              <Image
                source={require('img/icons/signup/icon_signup_email.png')}
                style={[styles.loginIcon]}
                resizeMode={'contain'}
              />
              <View style={[styles.inputWrapper, { marginLeft: 10 }]}>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="email"
                  onChangeText={this.changeUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholderTextColor={WHITE}
                  value={username}
                />
              </View>
            </View>
            <View style={[styles.space, { flexDirection: 'row' }]} >
              <Image
                source={require('img/icons/signup/icon_signup_phone.png')}
                style={[styles.loginIcon]}
                resizeMode={'contain'}
              />
              <View style={[styles.inputWrapper, { marginLeft: 10 }]}>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="phone number"
                  onChangeText={this.changeEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  tintColor="red"
                  clearButtonMode="while-editing"
                  placeholderTextColor={WHITE}
                  value={email}
                />
              </View>
            </View>
            <ActionButton
              label="Recover Password"
              upperCase={false}
              isActive={isActive}
              onPress={this.handleSubmit}
              labelStyle={{ color }}
              style={[styles.loginButton, { backgroundColor, borderColor: backgroundColor }, styles.space]}
            />
          </View>
          <TouchableOpacity onPress={onBack}>
            <AuxText upperCase={false} style={[styles.lightText, styles.bold, { marginBottom: 20 }]}>
              Back to Login Page
            </AuxText>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
