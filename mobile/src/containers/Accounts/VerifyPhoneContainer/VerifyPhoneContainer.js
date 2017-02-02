import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { VerifyPhone } from 'AppComponents';
import { AlertMessage } from 'AppUtilities';
import { VERIFICATION_SERVICE } from 'AppServices';
import { YELLOW, WHITE } from 'AppColors';
import { styles } from '../styles';
import { AuxText } from 'AppFonts';

class VerifyPhoneContainer extends Component {
  static propTypes = {
    phone: PropTypes.object.isRequired,
    feathers: PropTypes.object.isRequired,
    navigateToSignup: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.submitVerification = ::this.submitVerification;
  }

  submitVerification(code) {
    const { feathers, phone, navigateToSignup } = this.props;
    const fullPhoneNumber = `${phone.dialCode}${phone.number}`;
    feathers.service(VERIFICATION_SERVICE)
      .patch(null, { code, phone: fullPhoneNumber })
      .then(res => res && navigateToSignup())
      .catch(() => (
        AlertMessage.showMessage('Invalid Code',
          'You entered wrong verification code, Please Try again')
      ));
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.logo} >
            <Image
              source={require('img/icons/signup/icon_signup_phone.png')}
              style={[styles.loginIcon]}
              resizeMode={'contain'}
            />
            <AuxText
              upperCase={false}
              style={[
                styles.containerLabel,
                styles.space,
                styles.verifyText,
                styles.transparent
              ]}
            >
              please enter the 4 digit passcod sent to your phone
            </AuxText>
          </View>
          <VerifyPhone
            submitVerification={this.submitVerification}
          />
          <TouchableOpacity style={styles.backButton} onPress={this.props.onBack}>
            <Text style={[{ color: WHITE }, styles.bold]}>back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connectFeathers(VerifyPhoneContainer);
