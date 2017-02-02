import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { AlertMessage } from 'AppUtilities';
import { ForgotPassword, ConfirmReset } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { RESET_PASSWORD_SERVICE } from 'AppServices';
import { styles } from '../styles';

class ForgotPasswordContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    routeBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showConfirm: false
    };
    this.handleSendEmail = ::this.handleSendEmail;
  }

  handleSendEmail(data) {
    const { feathers } = this.props;
    const resetPasswordService = feathers.service(RESET_PASSWORD_SERVICE);
    resetPasswordService.create(data)
      .then(() => this.setState({ showConfirm: true }))
      .catch(error => {
        AlertMessage.fromRequest(error)
      });
  }

  render() {
    const { showConfirm } = this.state;
    const { routeBack } = this.props;
    return (
      <View style={styles.container}>
        { showConfirm ?
          <ConfirmReset
            onBack={routeBack}
          />
        :
          <ForgotPassword
            onBack={routeBack}
            handleSendEmail={this.handleSendEmail}
          />
        }
      </View>
    );
  }
}

export default connectFeathers(ForgotPasswordContainer, true);
