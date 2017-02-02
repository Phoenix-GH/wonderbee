import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { VALIDATIONS } from 'AppConstants';
import { AUX_TEXT } from 'AppColors';
import { SimpleTopNav, Form, TextInputWithAddons } from 'AppComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProfileButton, Link } from 'AppButtons';
import { AlertMessage } from 'AppUtilities';
import { USER_SERVICE } from 'AppServices';
import { styles } from './styles';
import { WHITE, BLUE } from 'AppColors';

class ChangePasswordContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { submitting: false };
    this.updatePassword = ::this.updatePassword;
  }

  async updatePassword(values) {
    const { currentPassword, newPassword } = values;
    const { feathers } = this.props;
    const currentUser = feathers.get('user');
    this.setState({ submitting: true });
    feathers.service(USER_SERVICE)
    .patch(currentUser.id, { updatePassword: true, currentPassword, password: newPassword })
    .then(() => AlertMessage.showMessage('Done!', 'Password has been updated successfully.'))
    .catch(error => AlertMessage.showMessage('Failed!', error.message));
  }

  render() {
    const { routeScene, routeBack } = this.props;
    const { submitting } = this.state;
    const icon = (
      <Icon
        name="lock"
        size={12}
        color={AUX_TEXT}
        style={styles.inputIcon}
      />
    );
    return (
      <View>
        <SimpleTopNav
          centerLabel="CHANGE PASSWORD"
          leftAction={routeBack}
          iconBack={true}
          color={WHITE}
        />
        <Form
          fields={[
            {
              label: 'Current Password',
              name: 'currentPassword',
              input: (
                <TextInputWithAddons
                  secureTextEntry={true}
                  selectTextOnFocus={true}
                  rightAddon={icon}
                />
              ),
              validations: [
                VALIDATIONS.required(),
              ],
            },
            {
              label: 'New Password',
              name: 'newPassword',
              input: (
                <TextInputWithAddons
                  secureTextEntry={true}
                  selectTextOnFocus={true}
                  rightAddon={icon}
                />
              ),
              validations: [
                VALIDATIONS.required(),
              ],
            },
            {
              label: 'Confirm Password',
              name: 'passwordConfirmation',
              input: (
                <TextInputWithAddons
                  secureTextEntry={true}
                  selectTextOnFocus={true}
                  rightAddon={icon}
                />
              ),
              validations: [
                VALIDATIONS.required(),
                (value, { newPassword }) => value !== newPassword && 'Passwords doesn\'t match'
              ],
            }
          ]}
          submitting={submitting}
          renderFooter={({ submit }) => (
            <ProfileButton
              label="Update"
              style={styles.submit}
              labelStyle={styles.submitLabel}
              onPress={submit}
              backgroundColor={BLUE}
            />
          )}
          style={styles.form}
          labelStyle={styles.label}
          onSubmit={this.updatePassword}
        />
        <Link
          label="Forgot Password?"
          style={styles.forgotPassword}
          onPress={() => routeScene('ForgotPasswordScene')}
        />
      </View>
    );
  }
}

export default connectFeathers(ChangePasswordContainer);
