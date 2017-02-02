import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { SignupActions } from 'AppComponents';
import { styles } from '../styles';
import {
  getHexagonLayout
} from 'AppUtilities';
import {
  HEXAGON_IMAGE_SIZE,
} from 'AppConstants';

class SignupActionsContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    navigateToSignupMethod: PropTypes.func.isRequired,
    navigateToSignup: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.hexagons = getHexagonLayout(3);
    this.signupWithCustom = ::this.signupWithCustom;
    this.signupWithFacebook = ::this.signupWithFacebook;
  }
  signupWithCustom() {
    this.props.navigateToSignupMethod();
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
      email,
      yearOfBirth,
      gender,
      location
    };
    this.props.navigateToSignup(updatedData);
  }

  render() {
    const { routeBack, feathers } = this.props;
    const yPosForLogoRow = this.hexagons[this.hexagons.length - 1][0].center.y;
    const heightStyle = { height: yPosForLogoRow + HEXAGON_IMAGE_SIZE / 2 };
    const opacityStyle = { opacity: 0.5 };
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={[heightStyle, opacityStyle, { top: -10 }]}>
            {this.renderHeader()}
          </View>
          <SignupActions
            feathers={feathers}
            goToLogin={routeBack}
            signupWithCustom={this.signupWithCustom}
            signupWithFacebook={this.signupWithFacebook}
          />
        </View>
      </View>
    );
  }
}

export default connectFeathers(SignupActionsContainer);
