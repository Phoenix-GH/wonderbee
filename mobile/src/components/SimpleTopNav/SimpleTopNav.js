import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import {
  GRAY,
  WHITE,
  AUX_TEXT,
  GREEN_GRADIENT_START,
  GREEN_GRADIENT_END,
  BLUE_GRADIENT_START,
  BLUE_GRADIENT_END,
} from 'AppColors';
import { LabelText } from 'AppFonts';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';


function renderLeftRightSide(label, action, sideFontSize, colorSet, sideWidth, rightLabelDisabled) {
  const color = rightLabelDisabled ? AUX_TEXT : colorSet;
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.button, { width: sideWidth }]}
      disabled={rightLabelDisabled}
      hitSlop={{ left: 40, right: 40, top: 20, bottom: 20 }}
    >
      {
        typeof label === 'object' ? label :
          <LabelText style={[{ color }, styles.rightLabel]} fontSize={sideFontSize}>
            {label}
          </LabelText>
      }
    </TouchableOpacity>
  );
}

const renderCenter = (centerLabel, centerFontSize, color) => {
  if (typeof centerLabel === 'object') {
    return centerLabel;
  }
  return (
    <View style={styles.centerView}>
      <LabelText
        style={[{ color, fontSize: centerFontSize, backgroundColor: 'transparent' }, styles.bold]}
      >
        {centerLabel}
      </LabelText>
    </View>
  );
};

const getLeftLabel = (leftLabel, tintColor) => {
  if (!leftLabel) {
    return (
      <Image
        source={require('img/icons/icon_back.png')}
        style={[styles.iconBack, { tintColor }]}
      />
    );
  }
  return leftLabel;
};

export function SimpleTopNav({
  leftLabel,
  rightLabel,
  centerLabel,
  leftAction,
  rightAction,
  backgroundColor,
  sideFontSize,
  centerFontSize,
  color,
  iconBack,
  wrapStyle,
  sideWidth,
  rightLabelDisabled,
  topNavBar,
  gradient,
  gradientColor,
}) {
  const containerStyle = {};
  const NavView = gradient ? LinearGradient : View;
  let viewProps = {};
  if (gradient) {
    viewProps = {
      start: [0.0, 1.0],
      end: [1.0, 1.0],
      colors: gradientColor === 'blue' ? [BLUE_GRADIENT_START, BLUE_GRADIENT_END] :
                                         [GREEN_GRADIENT_START, GREEN_GRADIENT_END],
    };
  } else {
    containerStyle.backgroundColor = backgroundColor;
  }
  if (!topNavBar) {
    containerStyle.paddingTop = 0;
    containerStyle.height = 50;
  }
  return (
    <NavView style={[styles.container, wrapStyle, containerStyle]} {...viewProps}>
      {leftLabel || iconBack ?
        renderLeftRightSide(
          getLeftLabel(leftLabel, color), leftAction, sideFontSize, color, sideWidth
        ) :
        <View style={styles.button} />
      }
      {centerLabel ? renderCenter(centerLabel, centerFontSize, color) : <View />}
      {rightLabel ?
        renderLeftRightSide(
          rightLabel, rightAction, sideFontSize, color, sideWidth, rightLabelDisabled
        ) :
        <View style={styles.button} />
      }
    </NavView>
  );
}

SimpleTopNav.propTypes = {
  iconBack: PropTypes.bool,
  leftLabel: PropTypes.any,
  rightLabel: PropTypes.any,
  centerLabel: PropTypes.any,
  leftAction: PropTypes.func,
  rightAction: PropTypes.func,
  backgroundColor: PropTypes.string,
  sideFontSize: PropTypes.number,
  centerFontSize: PropTypes.number,
  color: PropTypes.string,
  wrapStyle: View.propTypes.style,
  sideWidth: PropTypes.number,
  rightLabelDisabled: PropTypes.bool,
  topNavBar: PropTypes.bool,
  gradient: PropTypes.bool,
  gradientColor: PropTypes.oneOf(['blue', 'green']),
};

SimpleTopNav.defaultProps = {
  iconBack: false,
  topNavBar: true,
  leftLabel: null,
  backgroundColor: GRAY,
  sideFontSize: 19,
  centerFontSize: 16,
  color: WHITE,
  sideWidth: 50,
  rightLabelDisabled: false,
  gradient: true,
  gradientColor: 'blue',
};
