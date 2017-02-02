import React, { Component, PropTypes } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { ActionButton } from 'AppButtons';
import { AuxText } from 'AppFonts';
import { WHITE, BLACK, GRAY, DARK_GRAY, SECONDARY_TEXT } from 'AppColors';
import { SeparatedInputs } from 'AppComponents';
import { dismissKeyboard } from 'AppUtilities';
import { styles } from '../styles';
import { WINDOW_WIDTH }from 'AppConstants';

export class VerifyPhone extends Component {
  static propTypes = {
    submitVerification: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      code: '0000'
    };
    this.handleSubmit = ::this.handleSubmit;
    this.onCodeChanged = ::this.onCodeChanged;
  }

  onCodeChanged(code) {
    this.setState({ code });
  }

  handleSubmit() {
    const { submitVerification } = this.props;
    const { code } = this.state;
    dismissKeyboard();
    submitVerification(code);
  }

  render() {
    const { code } = this.state;
    const isActive = !!code;
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>
          <SeparatedInputs
            onChange={this.onCodeChanged}
            autoFocus={true}
          />
          <View style={[
            styles.bottomContainer,
            { justifyContent: 'flex-start', alignItems: 'center', }]}
          >
            <ActionButton
              label="SUBMIT"
              isActive={isActive}
              onPress={this.handleSubmit}
              style={[
                styles.space, styles.loginButton,
                { backgroundColor, borderColor: backgroundColor }]}
              labelStyle={{ color }}
            />
            <TouchableOpacity style={styles.space}>
              <AuxText upperCase={false} style={[styles.lightText, styles.bold]}>
                Resend Pascode
              </AuxText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
