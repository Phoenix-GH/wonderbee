import React, { Component, PropTypes } from 'react';
import { Text, TextInput } from 'react-native';

export class AutoGrowInput extends Component {
  static propTypes = {
    onChangeHeight: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    minHeight: PropTypes.number.isRequired,
    maxHeight: PropTypes.number,
    style: Text.propTypes.style,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Type here'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      height: props.minHeight,
      maxHeight: props.maxHeight || props.minHeight * 3
    };
    this._onChange = ::this._onChange;
    this._onFocus = ::this._onFocus;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value === '' && nextState.height !== nextProps.minHeight) {
      this.setState({ height: nextProps.minHeight });
      this.props.onChangeHeight(nextProps.minHeight);
    }
    return true;
  }

  _onChange(event) {
    const { height } = event.nativeEvent.contentSize;
    if (this.state.height < height && height < this.state.maxHeight) {
      this.setState({
        height
      });
      this.props.onChangeHeight(height);
    }
  }

  _onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  render() {
    const { height } = this.state;
    return (
      <TextInput
        { ...this.props }
        multiline={true}
        placeholder={this.props.placeholder}
        onChange={this._onChange}
        onFocus={this._onFocus}
        style={[this.props.style, { height }]}
      />
    );
  }
}
