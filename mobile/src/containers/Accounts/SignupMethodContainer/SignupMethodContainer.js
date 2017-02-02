import React, { Component, PropTypes } from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { SignupMethod } from 'AppComponents';
import { getHexagonLayout, AlertMessage } from 'AppUtilities';
import { HEXAGON_IMAGE_SIZE, WINDOW_HEIGHT } from 'AppConstants';
import { connectFeathers } from 'AppConnectors';
import { VERIFICATION_SERVICE } from 'AppServices';
import { styles } from '../styles';

class SignupMethodContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    jumpTo: PropTypes.func.isRequired,
    goToNext: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.hexagons = getHexagonLayout(3);
    this.determinePhoneVerification = ::this.determinePhoneVerification;
  }

  determinePhoneVerification(emailOrPhone, isPhone) {
    const { goToNext, feathers } = this.props;

    if (!isPhone) {
      return goToNext(emailOrPhone);
    }
    const fullPhoneNumber = `${emailOrPhone.dialCode}${emailOrPhone.number}`;
    return feathers.service(VERIFICATION_SERVICE)
      .create({ phone: fullPhoneNumber })
      .then(() => goToNext(emailOrPhone, isPhone))
      .catch(err => console.log(err) || AlertMessage.fromRequest(err));
  }

  render() {
    const { jumpTo, feathers } = this.props;
    const yPosForLogoRow = this.hexagons[this.hexagons.length - 1][0].center.y;
    const heightStyle = { height: yPosForLogoRow + HEXAGON_IMAGE_SIZE / 2 };

    return (
      <View style={styles.wrapper}>
          <KeyboardAvoidingView
            behavior={'position'}
            style={[styles.flex]}
            contentContainerStyle={styles.flex}
            keyboardVerticalOffset={ - (2 * WINDOW_HEIGHT / 3 - heightStyle.height - 30) }
          >
            <SignupMethod
              feathers={feathers}
              goToLogin={() => jumpTo('LoginScene')}
              goToNext={this.determinePhoneVerification}
            />
          </KeyboardAvoidingView>

      </View>
    );
  }
}

export default connectFeathers(SignupMethodContainer);
