import React, { PropTypes } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { ForgotPasswordContainer } from 'AppContainers';
import { WINDOW_HEIGHT } from 'AppConstants';
import { BackgroundAccounts } from 'AppComponents';
import { SIGNUP_GRADIENT_START, SIGNUP_GRADIENT_END } from 'AppColors';
import { styles } from '../styles';

export const ForgotPasswordScene = ({
  onBack
}) => {
  return (
    <BackgroundAccounts style={styles.flex}>
      <KeyboardAvoidingView
        behavior={'position'}
        style={styles.flex}
        contentContainerStyle={styles.flex}
        keyboardVerticalOffset={ -(0.6 * WINDOW_HEIGHT - 68) }
      >
        <ForgotPasswordContainer
          routeBack={onBack}
        />
      </KeyboardAvoidingView>
    </BackgroundAccounts>
  );
};

ForgotPasswordScene.propTypes = {
  onBack: PropTypes.func.isRequired
};
