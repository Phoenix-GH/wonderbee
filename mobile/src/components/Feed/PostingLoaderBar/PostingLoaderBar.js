import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { TextRegular } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY, BLUE, WHITE } from 'AppColors';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    position: 'absolute',
    width: WINDOW_WIDTH,
    top: 20,
    left: 0,
    height: 40,
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH / 3,
  },
  text: {
    fontSize: 20,
    color: GRAY,
  },
});

export function PostingLoaderBar() {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <TextRegular style={styles.text}>
          Posting...
        </TextRegular>
      </View>
      <Progress.Bar
        height={15}
        width={WINDOW_WIDTH * 2 / 3 - 40}
        indeterminate={true}
        color={BLUE}
      />
    </View>
  );
}
