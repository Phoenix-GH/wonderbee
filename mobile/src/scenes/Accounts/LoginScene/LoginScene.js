import React, { Component, PropTypes } from 'react';
import { KeyboardAvoidingView, View, StatusBar, Animated } from 'react-native';
import { LoginContainer } from 'AppContainers';
import { connectFeathers } from 'AppConnectors';
import { WINDOW_HEIGHT } from 'AppConstants';
import { FacebookModal, BackgroundAccounts } from 'AppComponents';
import { styles } from '../styles';

class LoginScene extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    resetRouteStack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFacebookModalVisible: false,
    };
    this.routeLoginSuccess = ::this.routeLoginSuccess;
    this.openFacebookModal = ::this.openFacebookModal;
    this.handleFacebookCancel = ::this.handleFacebookCancel;
    this.signupWithFacebook = ::this.signupWithFacebook;
  }

  signupWithFacebook(facebookData) {
    const {
      name,
      picture,
      location,
      email,
      birthday,
      gender
    } = facebookData;

    const yearOfBirth = birthday ? parseInt(birthday.substr(-4), 10) : null;
    const avatarUrl = picture.data.url;

    const updatedData = {
      name,
      avatarUrl,
      yearOfBirth,
      gender,
      location
    };
    this.props.routeScene('SignupScene', { email, facebook: updatedData });
  }

  openFacebookModal() {
    this.setState({ isFacebookModalVisible: true });
  }
  handleFacebookCancel() {
    this.setState({ isFacebookModalVisible: false });
  }
  routeLoginSuccess() {
    this.props.resetRouteStack();
  }

  render() {
    const { feathers, routeScene } = this.props;
    const { isFacebookModalVisible } = this.state;
    const keyboardOffset = - (WINDOW_HEIGHT - 41 * WINDOW_HEIGHT / 120 - 60);

    return (
        <View style={[styles.container]}>
          <StatusBar hidden={false} />
          <BackgroundAccounts style={styles.flex}>
            <Animated.View >
              <KeyboardAvoidingView
                behavior={'position'}
                style={styles.flex}
                contentContainerStyle={styles.flex}
                keyboardVerticalOffset={keyboardOffset}
              >
                <LoginContainer
                  feathers={feathers}
                  routeSignup={() => routeScene('SignupMethodScene')}
                  routeForgotPassword={() => routeScene('ForgotPasswordScene')}
                  routeLoginSuccess={this.routeLoginSuccess}
                  signupWithFacebook={this.signupWithFacebook}
                  onFacebookModal={this.openFacebookModal}
                  handleFacebookCancel={this.handleFacebookCancel}
                />
              </KeyboardAvoidingView>
            </Animated.View>
            <FacebookModal
              isVisible={isFacebookModalVisible}
              onCancel={this.handleFacebookCancel}
            />
          </BackgroundAccounts>
        </View>
      );
  }
}

export default connectFeathers(LoginScene, true);
