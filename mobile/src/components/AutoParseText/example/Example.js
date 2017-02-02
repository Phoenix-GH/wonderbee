/* eslint-disable */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { AutoParseText } from 'AppComponents';

const styles = StyleSheet.create({
  defaultText: {
    color: 'black'
  },
  JustHive: {
    color: 'yellow'
  }
});

export class Example extends Component {
  constructor(...args) {
    super(...args);
    this.handleEmailPress = ::this.handleEmailPress;
    this.handlePhonePress = ::this.handlePhonePress;
    this.handleUrlPress = ::this.handleUrlPress;
    this.handleUsernamePress = ::this.handleUsernamePress;
    this.handleHashTagPress = ::this.handleHashTagPress;
    this.handleJustHivePress = ::this.handleJustHivePress;
  }
  handleEmailPress(email) {}

  handlePhonePress(phone) {}

  handleUrlPress(url) {}

  handleUsernamePress(username) {}

  handleHashTagPress(hashTag) {}

  handleJustHivePress() {}

  render() {
    return(
      <AutoParseText
        style={styles.defaultText}
        additionalParse={[
          { pattern: /^justhive$/i, style: styles.justhive, onPress: this.handleJustHivePress }
        ]}
        handleEmailPress={this.handleEmailPress}
        handleHashTagPress={this.handleHashTagPress}
        handlePhonePress={this.handlePhonePress}
        handleUrlPress={this.handleUrlPress}
        handleUsernamePress={this.handleUsernamePress}
      >
        message from @shahen #react #justhive {'\n'}
        handle http://url.com {'\n'}
        let's call me 555-000 {'\n'}
        email shahen.hovhannisyan.94@gmail.com {'\n'}
        justhive
      </AutoParseText>
    );
  }

}
