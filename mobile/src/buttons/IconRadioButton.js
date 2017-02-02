import React, { PropTypes } from 'react';
import { View, Text, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerVertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    backgroundColor: 'transparent',
    width: 14,
    height: 14,
    borderColor: WHITE,
    borderWidth: 2,
    borderRadius: 7,
    marginRight: 5,
  },
  m_b_5: {
    marginBottom: 5
  },
  label: {
    color: WHITE,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
  },
  image: {
    tintColor: WHITE,
    height: 30,
    marginRight: 3,
  },
  icon: {
    marginRight: 3,
  }
});

export function IconRadioButton({
  isActive,
  style,
  icon,
  label,
  labelStyle,
  iconStyle,
  onPress,
  vertical
}) {
  const opacityStyle = !isActive ? { opacity: 0.5 } : {};
  const activeCircleStyle = isActive ? { backgroundColor: WHITE } : {};
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      underlayColor="transparent"
    >
      <View style={[vertical ? styles.containerVertical : styles.container, style, opacityStyle]}>
        {typeof icon !== 'string' ? (
          <Image
            resizeMode="contain"
            source={icon}
            style={[styles.image, iconStyle, vertical ? styles.m_b_5 : {}]}
          />
        ) : (
          <Icon
            name={icon}
            size={20}
            color={WHITE}
            style={[styles.icon, iconStyle]}
          />
      )}
      <View style={[styles.circle, activeCircleStyle]} />
        {label && (
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}


IconRadioButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.any.isRequired,
  isActive: PropTypes.bool.isRequired,
  style: View.propTypes.style,
  label: PropTypes.any,
  labelStyle: Text.propTypes.style,
  iconStyle: PropTypes.object,
  vertical: PropTypes.bool,
};

IconRadioButton.defaultProps = {
  icon: null,
  isActive: false,
  vertical: false
};
