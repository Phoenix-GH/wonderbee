import React, { Component, PropTypes } from 'react';
import { SignupMethodContainer } from 'AppContainers';
import { StyleSheet } from 'react-native';
import { SIGNUP_GRADIENT_START, SIGNUP_GRADIENT_END } from 'AppColors';
import { BackgroundAccounts } from 'AppComponents';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});


export class SignupMethodScene extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    jumpTo: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.goToNext = ::this.goToNext;
  }
  goToNext(emailOrPhone, isPhone) {
    const { routeScene } = this.props;
    if (isPhone) {
      return routeScene('VerifyPhoneScene', { phone: emailOrPhone });
    }
    return routeScene('SignupScene', { email: emailOrPhone });
  }
  render() {
    return (
      <BackgroundAccounts style={styles.flex}>
        <SignupMethodContainer
          jumpTo={this.props.jumpTo}
          goToNext={this.goToNext}
        />
      </BackgroundAccounts>
    );
  }
}
