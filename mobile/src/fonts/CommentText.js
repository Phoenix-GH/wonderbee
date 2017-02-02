import React, { PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { DARK_GRAY } from 'AppColors';
import { AutoParseText } from 'AppComponents';

const styles = StyleSheet.create({
  comment: {
    color: DARK_GRAY,
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
  },
});

function CommentTextWrap(props) {
  if (props.showMore) {
    return <TouchableOpacity onPress={props.showMore} {...props} />;
  }
  return <View {...props} />;
}

CommentTextWrap.propTypes = {
  showMore: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
};

export function CommentText(props) {
  const { children, style, showMore, routeScene, ...handlers } = props;
  return (
    <CommentTextWrap showMore={showMore}>
      <AutoParseText
        style={[styles.comment, style]}
        handleHashTagPress={hashTag => {
          routeScene('FeedScene', {
            hasNavBar: true,
            hashtags: [hashTag],
            navBarCenterLabel: hashTag,
          });
        }}
        handleUsernamePress={uname => uname}
        handleEmailPress={email => email}
        handlePhonePress={phone => phone}
        handleUrlPress={url => url}
        {...handlers}
      >
        {children}
      </AutoParseText>
    </CommentTextWrap>
  );
}

CommentText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.number,
  showMore: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  routeScene: PropTypes.func,
};
