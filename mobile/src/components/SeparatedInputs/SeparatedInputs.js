import React, { Component, PropTypes } from 'react';
import { View, TextInput, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles';
import { SECONDARY_TEXT } from 'AppColors';
import { dismissKeyboard } from 'AppUtilities';
import { WINDOW_WIDTH } from 'AppConstants';
import shallowCompare from 'react-addons-shallow-compare';
import { AuxText } from 'AppFonts';

export class SeparatedInputs extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    numberPlaceholder: PropTypes.bool,
    placeholder: PropTypes.string,
    initialValue: PropTypes.string,
  };
  static defaultProps = {
    autoFocus: false,
    numberPlaceholder: true,
    initialValue: '0000',
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: props.initialValue,
      codeArray: props.initialValue && props.initialValue !== '0000' &&
                 props.initialValue.split('') || [],
      hidePlaceholder: !props.placeholder || props.initialValue !== '0000'
    };
    this.changeCode = ::this.changeCode;
    this.getNumber = ::this.getNumber;
    this.getCode = ::this.getCode;
    this.hidePlaceholder = ::this.hidePlaceholder;
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.refs[0].focus();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  getNumber(indx) {
    return this.state.code.toString()[indx];
  }

  getCode() {
    return this.state.code;
  }

  changeCode(_number, indx) {
    const number = _number === '' ? 0 : _number;
    const { code, codeArray } = this.state;
    const newCodeArray = codeArray.slice();
    newCodeArray[indx] = _number;

    const newCode = code.substring(0, indx) + number.toString() + code.substr(indx + 1);
    if (!!_number && indx < 3) {
      this.refs[indx + 1].focus();
    }
    if (indx === 3) {
      dismissKeyboard();
    }
    this.props.onChange(newCode, newCodeArray);
    this.setState({ code: newCode, codeArray: newCodeArray });
  }

  hidePlaceholder() {
    LayoutAnimation.easeInEaseOut();
    this.refs[0].focus();
    this.setState({ hidePlaceholder: true });
  }

  render() {
    const bottomBorderWidth = WINDOW_WIDTH / 8;
    const { numberPlaceholder, placeholder } = this.props;
    const { hidePlaceholder, codeArray } = this.state;

    return (
      <View style={[styles.space, styles.alignMiddle, { flexDirection: 'row' }]}>
        <View style={{ alignItems: 'center' }} >
          <TextInput
            ref={"0"}
            style={[styles.input, styles.phoneCode]}
            underlineColorAndroid="transparent"
            placeholder={numberPlaceholder ? '0' : ''}
            onChangeText={(val) => this.changeCode(val, 0)}
            placeholderTextColor={SECONDARY_TEXT}
            keyboardType="numeric"
            maxLength={1}
            value={codeArray[0]}
          />
          <View style={[styles.inputWrapper, { width: bottomBorderWidth, height: 2 }]} />
        </View>
        <View style={{ alignItems: 'center' }} >
          <TextInput
            ref={"1"}
            style={[styles.input, styles.phoneCode]}
            underlineColorAndroid="transparent"
            placeholder={numberPlaceholder ? '0' : ''}
            onChangeText={(val) => this.changeCode(val, 1)}
            placeholderTextColor={SECONDARY_TEXT}
            keyboardType="numeric"
            maxLength={1}
            value={codeArray[1]}
          />
          <View style={[styles.inputWrapper, { width: bottomBorderWidth, height: 2 }]} />
        </View>
        <View style={{ alignItems: 'center' }} >
          <TextInput
            ref={"2"}
            style={[styles.input, styles.phoneCode]}
            underlineColorAndroid="transparent"
            placeholder={numberPlaceholder ? '0' : ''}
            onChangeText={(val) => this.changeCode(val, 2)}
            placeholderTextColor={SECONDARY_TEXT}
            keyboardType="numeric"
            maxLength={1}
            value={codeArray[2]}
          />
          <View style={[styles.inputWrapper, { width: bottomBorderWidth, height: 2 }]} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            ref={"3"}
            style={[styles.input, styles.phoneCode]}
            underlineColorAndroid="transparent"
            placeholder={numberPlaceholder ? '0' : ''}
            onChangeText={(val) => this.changeCode(val, 3)}
            placeholderTextColor={SECONDARY_TEXT}
            keyboardType="numeric"
            maxLength={1}
            value={codeArray[3]}
          />
          <View style={[styles.inputWrapper, { width: WINDOW_WIDTH / 8, height: 2 }]} />
        </View>
        {!hidePlaceholder && (
          <View style={styles.placeholder}>
            <TouchableWithoutFeedback onPress={this.hidePlaceholder}>
              <AuxText
                style={[
                  styles.transparent,
                  styles.lightText,
                  styles.inputTextCenter
                ]}
                upperCase={false}
              >
                {placeholder}
              </AuxText>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    );
  }
}
