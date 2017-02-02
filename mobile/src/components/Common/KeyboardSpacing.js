/**
 * Created by nick on 26/08/16.
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Animated,
  Platform
} from 'react-native';
import Keyboard from 'Keyboard';
import { NAVBAR_HEIGHT } from 'AppConstants';
export class KeyboardSpacing extends Component {

  static propTypes = {
    enableAndroid: PropTypes.bool.isRequired,
    onKeyboardUpdated: PropTypes.func.isRequired,
    customMargin: PropTypes.number,
  };

  static defaultProps = {
    enableAndroid: false,
    onKeyboardUpdated: () => {},
    customMargin: 0,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      keyboardHeight: new Animated.Value(0),
      keyboardShown: false,
    };
    this.onKeyboardUpdated = ::this.onKeyboardUpdated;
  }

  componentWillMount() {
    this.subscriptions = [];
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardUpdated),
      ];
    } else {
      if (this.props.enableAndroid) {
        this.subscriptions = [
          Keyboard.addListener('keyboardDidHide', this.onKeyboardUpdated),
          Keyboard.addListener('keyboardDidShow', this.onKeyboardUpdated),
        ];
      }
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  }

  onKeyboardUpdated(event) {
    const { keyboardShown } = this.state;
    let toValue = keyboardShown ? 0 : event.endCoordinates.height;
    toValue -= this.props.customMargin;
    // in android case, UI View will be resizing & pushed up automatically after view has keyboard.
    // there's no need to push up keyboard height, but sometimes need to push up navbar height for android
    if (this.props.enableAndroid && Platform.OS === 'android') {
      toValue = NAVBAR_HEIGHT;
    }
    Animated.timing(
      this.state.keyboardHeight, {
        toValue,
        duration: 150,
      }
    ).start(() => {
      this.props.onKeyboardUpdated(!keyboardShown);
    });
    this.setState({ keyboardShown: !keyboardShown });
  }

  render() {
    return (
      <Animated.View style={{ height: this.state.keyboardHeight }} />
    );
  }
}
