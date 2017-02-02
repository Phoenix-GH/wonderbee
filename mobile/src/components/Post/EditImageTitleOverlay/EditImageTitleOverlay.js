/**
 * Created by nick on 21/07/16.
 */
import React, { Component, PropTypes } from 'react';
import { KeyboardAvoidingView, View, TextInput, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { STATUSBAR_HEIGHT } from 'AppConstants';
import { styles } from './styles';

export class EditImageTitleOverlay extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onChangeTitle: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: props.title
    };
    this.onChangeTitle = ::this.onChangeTitle;
  }

  onChangeTitle() {
    this.props.onChangeTitle(this.state.title);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.row} onPress={this.onChangeTitle}>
          <LabelText style={styles.label} fontSize={15}>CHANGE IMAGE NAME</LabelText>
        </TouchableOpacity>
        <View style={styles.imageContainer} />
        <View style={styles.row} />
        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-STATUSBAR_HEIGHT}>
        <View style={styles.bottomArea}>
          <TextInput
            onChangeText={(title) => this.setState({ title })}
            value={this.state.title}
            style={styles.input}
          />
        </View>
      </KeyboardAvoidingView>
      </View>
    );
  }
}
