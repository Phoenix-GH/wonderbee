import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { AutoGrowInput } from '../';
import { WHITE, PRIMARY_TEXT } from 'AppColors';
import { styles } from './styles';

export class InputRow extends Component {
  static propTypes = {
    insertMessage: PropTypes.func.isRequired,
    sendDisabled: PropTypes.bool.isRequired,
    hasCommentIcon: PropTypes.bool,
    hasCameraIcon: PropTypes.bool,
    placeholderIcon: PropTypes.number,
    placeholderIconStyle: View.propTypes.style,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    sendDisabled: false,
    hasCommentIcon: true,
    hasCameraIcon: false,
    placeholderIcon: require('img/icons/icon_comment_placeholder.png'),
    placeholderIconStyle: styles.iconCommentPlaceholder,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showSend: false,
      inputText: '',
      rowHeight: 40,
    };
    this.changeText = ::this.changeText;
    this.insertMessage = ::this.insertMessage;
    this.onChangeHeight = :: this.onChangeHeight;
    this.onFocus = ::this.onFocus;
  }

  onChangeHeight(rowHeight) {
    return rowHeight !== this.state.rowHeight ?
      this.setState({ rowHeight: rowHeight + 10 }) :
      null;
  }

  onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  insertMessage() {
    this.props.insertMessage(this.state.inputText);
    this.setState({
      inputText: '',
    });
  }

  changeText(inputText) {
    this.setState({
      inputText,
      showSend: inputText.length > 0,
    });
  }

  render() {
    const { showSend, inputText, rowHeight } = this.state;
    const {
      sendDisabled,
      placeholderIcon,
      placeholderIconStyle,
      hasCommentIcon,
      hasCameraIcon
    } = this.props;
    return (
      <View style={[styles.container, { height: rowHeight }]}>
        {hasCameraIcon &&
          <View style={ styles.cameraIconView }>
            <Image
              source={require('img/icons/icon_insert_image.png')}
              style={ styles.cameraIconImage }
            />
          </View>
        }
        <AutoGrowInput
          placeholder={this.props.placeholder}
          minHeight={30}
          style={styles.input}
          onFocus={this.onFocus}
          onChangeText={this.changeText}
          value={inputText}
          onChangeHeight={this.onChangeHeight}
        />
        {hasCommentIcon &&
          <View style={ styles.placeholderIconContainer }>
            <Image source={placeholderIcon} style={placeholderIconStyle} />
          </View>
        }
        {showSend ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={this.insertMessage}
            disabled={sendDisabled}
          >
            <Text style={[styles.send, { color: sendDisabled ? 'gray' : WHITE }]}>
              Send
            </Text>
          </TouchableOpacity>
        ) : <TouchableOpacity style={styles.sides} />}
      </View>
    );
  }
}
