import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';
import { VerifyPhoneContainer } from 'AppContainers';
import { SIGNUP_GRADIENT_START, SIGNUP_GRADIENT_END } from 'AppColors';
import { BackgroundAccounts } from 'AppComponents';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});

export class VerifyPhoneScene extends Component {
  static propTypes = {
    phone: PropTypes.shape({
      number: PropTypes.string.isRequired,
      dialCode: PropTypes.string.isRequired
    }).isRequired,
    routeScene: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.navigateToSignup = ::this.navigateToSignup;
  }
  navigateToSignup() {
    const { routeScene, phone } = this.props;
    return routeScene('SignupScene', { phone });
  }
  render() {
    const { phone } = this.props;
    return (
      <BackgroundAccounts style={styles.flex}>
        <VerifyPhoneContainer
          phone={phone}
          navigateToSignup={this.navigateToSignup}
          onBack={this.props.onBack}
        />
      </BackgroundAccounts>
    );
  }
}
