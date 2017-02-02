/* global fetch */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connectFeathers } from 'AppConnectors';
import { LOCAL_CODES, WINDOW_WIDTH } from 'AppConstants';
import { dismissKeyboard, AlertMessage } from 'AppUtilities';
import validator from 'validator';
import { ActionButton } from 'AppButtons';
import { DialCodesModal } from 'AppComponents';
import { AuxText } from 'AppFonts';
import { GUEST_SERVICE, CLIENT_TOKEN } from 'AppServices';
import { DARK_GRAY, GRAY, INVALID_TEXT, VALID_TEXT, WHITE, BLACK, SECONDARY_TEXT } from 'AppColors';
import { styles } from '../styles';

class SignupMethod extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    goToNext: PropTypes.func,
    goToLogin: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      phoneValidated: false,
      phoneValidationError: false,
      emailValidated: false,
      emailValidationError: false,
      dialCodesModalVisible: false,
      localCode: LOCAL_CODES[0]
    };
    this.changeEmail = ::this.changeEmail;
    this.changePhone = ::this.changePhone;
    this.handleNext = ::this.handleNext;
    this.toggleDialCodesModal = ::this.toggleDialCodesModal;
    this.isValidEmailOrPhone = ::this.isValidEmailOrPhone;
  }

  changeEmail(email) {
    if (!validator.isEmail(email)) {
      return this.setState({
        email,
        emailValidated: false,
        emailValidationError: false
      });
    }
    const request = {
      token: CLIENT_TOKEN,
      requestType: 'checkUnique',
      model: 'users',
      checkValues: {
        email,
      },
    };
    this.setState({ email });
    return this.props.feathers.service(GUEST_SERVICE).create(request)
    .then(results => (!results ? (
      this.setState({
        emailValidated: true,
        emailValidationError: false
      })
    ) : (
      this.setState({
        emailValidated: true,
        emailValidationError: true
      })
    )))
    .catch(error => AlertMessage.fromRequest(error));
  }

  changePhone(phone = '') {
    /*
    *
    * I just checking is the phone number digits length gt than 3.
    *   (It's minimum valid phone number)
    * I don't use validator in this case,
    * because supported only limited locals
    * for example there are not a validator for hy-ARM(Armenia),
    * and many other locals doesn't exists,
    * currently we don't able to validate all locals phones
    *
    * */
    if (phone.length < 4) {
      return this.setState({
        phone,
        phoneValidated: false,
        phoneValidationError: false
      });
    }

    const request = {
      token: CLIENT_TOKEN,
      requestType: 'checkUnique',
      model: 'users',
      checkValues: {
        phone,
      },
    };
    this.setState({ phone });
    return this.props.feathers.service(GUEST_SERVICE).create(request)
    .then(results => (!results ? (
      this.setState({
        phoneValidated: true,
        phoneValidationError: false
      })
    ) : (
      this.setState({
        phoneValidated: false,
        phoneValidationError: true
      })
    )))
    .catch(error => AlertMessage.fromRequest(error));
  }

  handleNext() {
    dismissKeyboard();
    const { goToNext } = this.props;
    const { email, phone, localCode } = this.state;
    const passData = email || {
      dialCode: localCode,
      number: phone
    };
    goToNext(passData, !!phone);
  }

  isValidEmailOrPhone() {
    const {
      phoneValidated,
      phoneValidationError,
      emailValidated,
      emailValidationError
    } = this.state;

    return (phoneValidated && !phoneValidationError) || (emailValidated && !emailValidationError);
  }

  toggleDialCodesModal() {
    dismissKeyboard();
    const { dialCodesModalVisible } = this.state;
    this.setState({
      dialCodesModalVisible: !dialCodesModalVisible
    });
  }

  render() {
    const { goToLogin } = this.props;
    const {
      email,
      phone,
      localCode,
      phoneValidated,
      phoneValidationError,
      emailValidated,
      emailValidationError,
      dialCodesModalVisible
    } = this.state;

    const phoneKeyboard = Platform.select({
      ios: 'number-pad',
      android: 'phone-pad',
    });
    const isActive = this.isValidEmailOrPhone();
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
          <View style={styles.container}>
            <View style={styles.normalizeContainer}>
              <Image
                source={require('img/icons/signup/icon_signup_user.png')}
                style={[styles.logo, styles.marginBottom10]}
              />
              <AuxText
                upperCase={false}
                style={[styles.containerLabel, styles.space, styles.transparent]}
              >
                Create your account
              </AuxText>
            </View>
            <View style={styles.top}>
              <View style={[styles.space, styles.row]}>
                <View style={[styles.space, styles.row]} >
                  <Image
                    source={require('img/icons/signup/icon_signup_email.png')}
                    style={[styles.loginIcon]}
                    resizeMode={'contain'}
                  />
                  <View style={[styles.inputWrapper, styles.marginLeft10]}>
                    <TextInput
                      style={styles.input}
                      editable={!phone}
                      underlineColorAndroid="transparent"
                      placeholder="email"
                      onChangeText={this.changeEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor={WHITE}
                      value={email}
                    />
                  </View>
                </View>
                {emailValidated &&
                <Icon
                  name={emailValidationError ? 'close' : 'check'}
                  size={25}
                  color={emailValidationError ? INVALID_TEXT : VALID_TEXT}
                  style={[styles.floatRight, styles.transparent]}
                />
                }
                {emailValidated && emailValidationError &&
                <Text style={[styles.errorText, styles.floatRight, styles.transparent]}>
                  Email already exists
                </Text>
                }
              </View>
              <AuxText
                style={[styles.space, styles.lightText, styles.textMiddleSize]}
                upperCase={false}
              >
                or
              </AuxText>
              <View style={[
                styles.space,
                styles.row,
                styles.overflowHidden,
                { width: WINDOW_WIDTH * 7 / 9 },
                { alignSelf: 'flex-start' },
                { marginLeft: 45 }
              ]}
              >
                <View style={[styles.space, styles.row]} >
                  <Image
                    source={require('img/icons/signup/icon_signup_phone.png')}
                    style={[styles.loginIcon]}
                    resizeMode={'contain'}
                  />
                  <View style={[
                    styles.inputWrapper,
                    styles.row,
                    { marginLeft: 10 }
                  ]}
                  >
                    <TouchableOpacity
                      onPress={this.toggleDialCodesModal}
                      style={[styles.row, styles.alignMiddle, styles.flex]}
                    >
                      <Icon
                        name={'keyboard-arrow-down'}
                        style={[styles.transparent, { padding: 0 }]}
                        size={20}
                        color={WHITE}
                      />
                      <Text
                        style={[
                          styles.transparent,
                          styles.textSmallSize,
                          styles.whiteNormal,
                          styles.inputFont,
                          { marginBottom: 2 }
                        ]}
                      >
                        {localCode}
                      </Text>
                    </TouchableOpacity>
                    <TextInput
                      ref={ref => this.phoneInputRef = ref}
                      style={[styles.input, styles.marginLeft10]}
                      editable={!email}
                      underlineColorAndroid="transparent"
                      placeholder="phone number"
                      onChangeText={this.changePhone}
                      keyboardType={phoneKeyboard}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor={WHITE}
                      value={phone}
                    />
                  </View>
                </View>
                {phoneValidated &&
                <Icon
                  name={phoneValidationError ? 'close' : 'check'}
                  size={25}
                  color={phoneValidationError ? INVALID_TEXT : VALID_TEXT}
                  style={[styles.floatRight, styles.transparent]}
                />
                }
                {phoneValidated && phoneValidationError &&
                <Text style={[styles.errorText, styles.floatRight, styles.transparent]}>
                  Phone already exists
                </Text>
                }
              </View>
              <ActionButton
                label="Submit"
                upperCase={false}
                labelStyle={{ color }}
                isActive={this.isValidEmailOrPhone()}
                onPress={this.handleNext}
                style={[
                  styles.space,
                  styles.loginButton,
                  { backgroundColor, borderColor: backgroundColor }
                ]}
              />
            </View>
            <TouchableOpacity onPress={goToLogin} style={styles.backButton} >
              <Text style={[styles.lightText, styles.bold]}>back</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <DialCodesModal
          onSelect={(code) => {
            this.phoneInputRef.focus();
            this.setState({
              localCode: code.dial_code,
              dialCodesModalVisible: false
            });
          }}
          isVisible={dialCodesModalVisible}
          onClickOutside={this.toggleDialCodesModal}
        />
      </View>
    );
  }
}

export default connectFeathers(SignupMethod);
