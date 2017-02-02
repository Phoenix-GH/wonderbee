import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { styles } from './styles';
import { emptyFunction } from 'AppUtilities';
import { REGEXPS } from 'AppConstants';

export const AutoParseText = ({
  style,
  phoneStyle,
  emailStyle,
  urlStyle,
  usernameStyle,
  hashtagStyle,
  handleEmailPress,
  handleUrlPress,
  handlePhonePress,
  handleUsernamePress,
  handleHashTagPress,
  additionalParse,
  numberOfLines,
  children,
}) => {
  const { USERNAME, HASH_TAG } = REGEXPS;
  const parse = [
    { type: 'phone', style: [styles.phone, phoneStyle], onPress: handlePhonePress },
    { type: 'email', style: [styles.email, emailStyle], onPress: handleEmailPress },
    { type: 'url', style: [styles.url, urlStyle], onPress: handleUrlPress },
    {
      pattern: USERNAME,
      style: [styles.username, usernameStyle],
      onPress: handleUsernamePress
    }, {
      pattern: HASH_TAG,
      style: [styles.hashtag, hashtagStyle],
      onPress: handleHashTagPress
    }].concat(additionalParse);
  return (
    <View style={styles.container}>
      <ParsedText parse={parse} style={style} numberOfLines={numberOfLines}>
        {children}
      </ParsedText>
    </View>
  );
};

AutoParseText.propTypes = {
  style: Text.propTypes.style,
  handleEmailPress: PropTypes.func,
  handleUrlPress: PropTypes.func,
  handlePhonePress: PropTypes.func,
  handleUsernamePress: PropTypes.func,
  handleHashTagPress: PropTypes.func,
  phoneStyle: Text.propTypes.style,
  emailStyle: Text.propTypes.style,
  urlStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  hashtagStyle: Text.propTypes.style,
  additionalParse: PropTypes.array,
  numberOfLines: PropTypes.number,
  children: PropTypes.string
};

AutoParseText.defaultProps = {
  handleEmailPress: emptyFunction,
  handleUrlPress: emptyFunction,
  handlePhonePress: emptyFunction,
  handleUsernamePress: emptyFunction,
  handleHashTagPress: emptyFunction,
  additionalParse: []
};
