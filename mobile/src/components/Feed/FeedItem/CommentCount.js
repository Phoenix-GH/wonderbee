import React, { PropTypes } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { GRAY, BLUE } from 'AppColors';
import { TextSemiBold } from 'AppFonts';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 3,
    paddingVertical: 5
  },
  commentCount: {
    color: GRAY,
    fontSize: 14,
  },
  iconBack: {
    tintColor: GRAY,
    transform: [
      { rotate: '180deg' },
    ],
    height: 10,
    resizeMode: 'contain',
  },
  iconBlue: {
    tintColor: BLUE
  },
  textBlue: {
    color: BLUE,
  },
});

export function CommentCount({ count }) {
  return (
    <View style={styles.row}>
      <TextSemiBold
        style={[styles.commentCount, count > 0 && styles.textBlue]}
      >
        {count > 0 ? count : 'No'} Comments
      </TextSemiBold>
      <Image
        source={require('img/icons/icon_back.png')}
        style={[styles.iconBack, count > 0 && styles.iconBlue]}
      />
    </View>
  );
}

CommentCount.propTypes = {
  count: PropTypes.number
};
