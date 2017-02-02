import React, { Component, PropTypes } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SignupContainer } from 'AppContainers';
import { WINDOW_HEIGHT } from 'AppConstants';
import { BackgroundAccounts } from 'AppComponents';
const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});

export class SignupScene extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    facebook: PropTypes.object,
    email: PropTypes.string,
    phone: PropTypes.shape({
      number: PropTypes.string.isRequired,
      dialCode: PropTypes.string.isRequired
    }),
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 'blue',
    };
    this.onSignupSuccess = ::this.onSignupSuccess;
    this.onLoginSuccess = ::this.onLoginSuccess;
  }
  onSignupSuccess() {
    this.props.routeScene('FindFriendsMethodScene', { signup: true });
  }
  onLoginSuccess() {
    this.setState({ type: 'green' });
  }
  render() {
    const { routeScene, facebook, phone, email, onBack } = this.props;
    return (
      <BackgroundAccounts
        style={styles.flex}
        type={this.state.type}
      >
        <KeyboardAvoidingView
          behavior={'position'}
          keyboardVerticalOffset={-9 * WINDOW_HEIGHT / 60 - 10}
          contentContainerStyle={styles.flex}
          style = {styles.flex}
        >
          <SignupContainer
            routeScene={routeScene}
            facebookData={facebook}
            onSuccess={this.onSignupSuccess}
            phone={phone}
            email={email}
            onBack={onBack}
            onLoginSuccess={this.onLoginSuccess}
          />
      </KeyboardAvoidingView>
    </BackgroundAccounts>
    );
  }
}
