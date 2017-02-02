import React, { Component, PropTypes } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';
import { SECONDARY_TEXT } from 'AppColors';

export class SearchInput extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    style: View.propTypes.style,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { isFocused: false };
    this.handleFocus = ::this.handleFocus;
    this.handleBlur = ::this.handleBlur;
  }

  getInputStyle() {
    if (this.state.isFocused) {
      return [styles.input, { textAlign: 'left' }];
    }
    return styles.input;
  }

  handleFocus() {
    this.setState({ isFocused: true });
  }

  handleBlur() {
    this.setState({ isFocused: false });
  }

  render() {
    const { value, style, onChange } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TextInput
          value={value}
          placeholder="Search"
          placeholderTextColor={SECONDARY_TEXT}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={this.getInputStyle()}
          onFocus={this.handleFocus}
          onChangeText={onChange}
          onBlur={this.handleBlur}
        />
      </View>
    );
  }
}
