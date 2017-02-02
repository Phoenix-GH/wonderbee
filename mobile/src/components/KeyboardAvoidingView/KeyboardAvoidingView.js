import React from 'react';
import { KeyboardAvoidingView as NonWrapped, Platform } from 'react-native';
import { STATUSBAR_HEIGHT } from 'AppConstants';

export function KeyboardAvoidingView(props) {
  const offset = Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0;
  return (
    <NonWrapped {...props} keyboardVerticalOffset={offset} />
  );
}
