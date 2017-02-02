import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { AutoGrowInput } from 'AppComponents';
import { emptyFunction } from 'AppUtilities';
import { styles } from './styles';

export class SendRow extends Component {
  static propTypes = {
    insertMessage: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    autoFocus: PropTypes.bool,
    defaultValue: PropTypes.string,
  };

  static defaultProps = {
    onBlur: emptyFunction,
    autoFocus: false,
    defaultValue: '',
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      showSend: false,
      inputText: props.defaultValue,
      rowHeight: 40,
    };
    this.changeText = ::this.changeText;
    this.insertMessage = ::this.insertMessage;
    this.onChangeHeight = :: this.onChangeHeight;
  }

  onChangeHeight(rowHeight) {
    return rowHeight !== this.state.rowHeight ?
      this.setState({ rowHeight: rowHeight + 10 }) :
      null;
  }

  insertMessage() {
    this.props.insertMessage(this.state.inputText);
    this.setState({
      inputText: '',
      showSend: false,
    });
  }

  changeText(inputText) {
    this.setState({
      inputText,
      showSend: inputText.length > 0,
    });
  }

  render() {
    const { onBlur, autoFocus } = this.props;
    const { showSend, inputText, rowHeight } = this.state;
    return (
      <View style={[styles.container, { height: rowHeight }]}>
        <AutoGrowInput
          placeholder="Type a message..."
          minHeight={30}
          style={styles.input}
          onChangeText={this.changeText}
          value={inputText}
          onChangeHeight={this.onChangeHeight}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
        <View style={styles.emoIconContainer}>
          <Image source={require('img/icons/icon_emoticon.png')} style={styles.iconEmoticon} />
        </View>
        {showSend ? (
          <TouchableOpacity
            style={styles.sendContainer}
            onPress={this.insertMessage}
          >
            <Text style={styles.send}>
              Send
            </Text>
          </TouchableOpacity>
        ) :
          <TouchableOpacity style={styles.iconContainer}>
            <Image source={require('img/icons/icon_nav_post.png')} style={styles.iconCamera} />
          </TouchableOpacity>
        }
      </View>
    );
  }
}
