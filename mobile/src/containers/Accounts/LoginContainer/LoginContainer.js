import React, { PropTypes } from 'react';
import { View, Image } from 'react-native';
import { Login, WelcomeBanner } from 'AppComponents';
import { AlertMessage, PushNotification } from 'AppUtilities';
import { styles } from '../styles';

export function LoginContainer({
  feathers,
  routeSignup,
  routeForgotPassword,
  routeLoginSuccess,
  signupWithFacebook,
  onFacebookModal,
  handleFacebookCancel,
}) {
  const logUserIn = (result) => {
    const user = { token: result.token, ...result.data };
    return routeLoginSuccess(user);
  };

  const handleLogin = (data) => {
    const { username, password } = data;
    return feathers.authenticate({
      type: 'local',
      username,
      password
    })
    .then((res) => {
      PushNotification.requestPermission();
      logUserIn(res);
    })
    .catch(err => AlertMessage.fromRequest(err));
  };

  return (
    <View style={styles.container}>
      <Login
        handleLogin={handleLogin}
        routeForgotPassword={routeForgotPassword}
        routeSignup={routeSignup}
        onFacebookModal={onFacebookModal}
        signupWithFacebook={signupWithFacebook}
        feathers={feathers}
        handleFacebookCancel={handleFacebookCancel}
      />
    </View>
  );
}

LoginContainer.propTypes = {
  feathers: PropTypes.object.isRequired,
  routeSignup: PropTypes.func.isRequired,
  routeForgotPassword: PropTypes.func.isRequired,
  routeLoginSuccess: PropTypes.func.isRequired,
  signupWithFacebook: PropTypes.func.isRequired,
  onFacebookModal: PropTypes.func.isRequired,
  handleFacebookCancel: PropTypes.func.isRequired,
};
