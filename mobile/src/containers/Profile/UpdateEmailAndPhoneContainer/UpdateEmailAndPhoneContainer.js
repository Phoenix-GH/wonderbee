import React, { Component, PropTypes } from 'react';
import { View, Text, Alert, TouchableOpacity, Platform } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { USER_SERVICE, CLIENT_TOKEN, GUEST_SERVICE } from 'AppServices';
import { VALIDATIONS, LOCAL_CODES } from 'AppConstants';
import { DialCodesModal } from 'AppComponents';
import { dismissKeyboard } from 'AppUtilities';
import { SimpleTopNav, Form, TextInputWithAddons } from 'AppComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProfileButton } from 'AppButtons';
import { styles } from './styles';
import { BLUE, WHITE, GRAY, AUX_TEXT } from 'AppColors';

class UpdateEmailAndPhoneContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: props.feathers.get('user'),
      submitting: false,
      phone: props.feathers.get('user').phone,
      dialCodesModalVisible: false,
      localCode: props.feathers.get('user').dialCode || LOCAL_CODES[0],
    };
    this.updateEmailAndPhone = ::this.updateEmailAndPhone;
    this.checkUnique = ::this.checkUnique;
    this.toggleDialCodesModal = ::this.toggleDialCodesModal;
  }

  checkUnique(value, field) {
    const { feathers } = this.props;
    const request = {
      token: CLIENT_TOKEN,
      requestType: 'checkUnique',
      model: 'users',
      checkValues: {
        [field]: value,
      },
    };
    return feathers.service(GUEST_SERVICE).create(request);
  }

  toggleDialCodesModal() {
    dismissKeyboard();
    const { dialCodesModalVisible } = this.state;
    this.setState({
      dialCodesModalVisible: !dialCodesModalVisible
    });
  }

  async updateEmailAndPhone(_values) {
    this.setState({ submitting: true });

    const values = {
      phone: _values.phone,
      dialCode: this.state.localCode,
      email: _values.email,
    };

    try {
      const { feathers } = this.props;
      const { user } = this.state;
      await feathers.service(USER_SERVICE).patch(user.id, values);
      feathers.set('user', {
        ...user,
        ...values,
      });
      Alert.alert('Success', 'Email and phone successfully updated.');
    } catch (error) {
      Alert.alert('Failed to update email and phone', error.message);
    }
    this.setState({ submitting: false });
  }

  render() {
    const { routeBack } = this.props;
    const { user, submitting, dialCodesModalVisible, localCode } = this.state;
    const phoneKeyboard = Platform.select({
      ios: 'number-pad',
      android: 'phone-pad',
    });

    return (
      <View>
        <SimpleTopNav
          centerLabel="UPDATE EMAIL & PHONE"
          leftAction={routeBack}
          iconBack={true}
          color={WHITE}
        />
        <Form
          fields={[
            {
              label: 'Email',
              name: 'email',
              input: (
                <TextInputWithAddons
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  rightAddon={(
                    <Icon
                      name="email"
                      size={18}
                      color={AUX_TEXT}
                      style={styles.inputIcon}
                    />
                  )}
                />
              ),
              validations: [
                VALIDATIONS.required(),
                VALIDATIONS.email(),
              ],
              asyncValidations: [val => ({
                promise: this.checkUnique(val, 'email'), message: 'Email already exists'
              })],
              validValues: [user.email]
            },
            {
              label: 'Phone',
              name: 'phone',
              input: (
                <TextInputWithAddons
                  style={{ paddingLeft: 2 }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={phoneKeyboard}
                  leftAddon={(
                    <TouchableOpacity
                      onPress={this.toggleDialCodesModal}
                      style={{ alignItems: 'center', marginLeft: -30, flexDirection: 'row' }}
                    >
                      <Icon
                        name="keyboard-arrow-down"
                        size={18}
                        color={GRAY}
                      />
                      <Text >{localCode}</Text>
                    </TouchableOpacity>
                  )}
                  rightAddon={(
                    <Icon
                      name="phone"
                      size={18}
                      color={AUX_TEXT}
                      style={styles.inputIcon}
                    />
                  )}
                />
              ),
              validations: [
                VALIDATIONS.required(),
                VALIDATIONS.phone(),
              ],
              asyncValidations: [val => ({
                promise: this.checkUnique(val, 'phone'), message: 'Phone already exists'
              })],
              validValues: [user.phone],
            },
          ]}
          initialValues={user}
          submitting={submitting}
          renderFooter={({ submit }) => (
            <ProfileButton
              label="Update"
              style={styles.submit}
              labelStyle={styles.submitLabel}
              onPress={submit}
            />
          )}
          style={styles.form}
          labelStyle={styles.label}
          onSubmit={this.updateEmailAndPhone}
        />
        <DialCodesModal
          onSelect={(code) => {
            this.setState({
              localCode: code.dial_code,
              dialCodesModalVisible: false
            });
          }}
          isVisible={dialCodesModalVisible}
          onClickOutside={this.toggleDialCodesModal}
        />
      </View>
    );
  }
}

export default connectFeathers(UpdateEmailAndPhoneContainer);
