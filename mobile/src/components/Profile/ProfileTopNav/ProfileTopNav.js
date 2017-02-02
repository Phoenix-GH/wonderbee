import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { WHITE, BLUE, BLUE_GRADIENT_START, BLUE_GRADIENT_END } from 'AppColors';
import { STATUSBAR_HEIGHT } from 'AppConstants';
import { TextBlack } from 'AppFonts';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLUE,
  },
  row: {
    flexDirection: 'row',
  },
  topRow: {
    paddingTop: STATUSBAR_HEIGHT,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
  centerLabel: {
    fontSize: 18,
    color: WHITE,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  side: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBack: {
    height: 20,
    width: 12
  }
});

const HIT_SLOP = { top: 20, left: 20, bottom: 20, right: 20 };

export function ProfileTopNav({
  leftLabel,
  leftAction,
  rightLabel,
  rightAction,
  centerLabel,
}) {
  return (
    <LinearGradient
      colors={[BLUE_GRADIENT_START, BLUE_GRADIENT_END]}
      start={[0.0, 1.0]} end={[1.0, 1.0]}
      style={styles.container}
    >
      <View style={[styles.row, styles.topRow]}>
        {leftAction ?
          <TouchableOpacity
            onPress={leftAction}
            style={styles.side}
            hitSlop={HIT_SLOP}
          >
            {leftLabel}
          </TouchableOpacity> :
          <View style={styles.side} />
        }
        <TextBlack style={styles.centerLabel}>{centerLabel}</TextBlack>
        <TouchableOpacity
          onPress={rightAction}
          style={styles.side}
          hitSlop={HIT_SLOP}
        >
          {rightLabel}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

ProfileTopNav.propTypes = {
  leftLabel: PropTypes.any.isRequired,
  rightLabel: PropTypes.any,
  leftAction: PropTypes.func,
  rightAction: PropTypes.func,
  centerLabel: PropTypes.string.isRequired,
};

ProfileTopNav.defaultProps = {
  leftLabel: <Image
    source={require('img/icons/icon_back.png')}
    style={[styles.iconBack, { tintColor: WHITE }]}
  />,
};
