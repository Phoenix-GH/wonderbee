import React, { PropTypes } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { TouchableOrNonTouchable } from 'AppComponents';
import { GRAY } from 'AppColors';

const styles = StyleSheet.create({
  default: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: GRAY,
  },
  noBorder: {
    borderWidth: 0,
  }
});


export const UserAvatar = ({
  avatarUrl,
  style,
  size,
  onPress,
  addBorder,
  iconStyle,
}) => {
  // console.log(iconStyle);
  let iconSize = size;
  if (iconStyle && iconStyle.width && iconStyle.height) {
    iconSize = iconStyle.width > iconStyle.height ? iconStyle.width : iconStyle.height;
  }

  const hasAvatar = !!avatarUrl;
  let avatar = null;
  if (hasAvatar && typeof avatarUrl === 'string') {
    avatar = { uri: avatarUrl };
  } else if (!hasAvatar) {
    avatar = require('img/icons/icon_fill_profile.png');
  } else {
    avatar = avatarUrl;
  }

  if (hasAvatar) {
    return (
      <TouchableOrNonTouchable onPress={onPress}>
        <Image
          source={avatar}
          resizeMode={'contain'}
          style={[
            { width: size + 10,
              height: size + 10,
            },
            styles.default,
            style,
            addBorder ? styles.border : styles.noBorder]}
        />
      </TouchableOrNonTouchable>
    );
  }
  return (
    <TouchableOrNonTouchable onPress={onPress}>
      <View style={[
        { width: size + 10, height: size + 10 },
        styles.default,
        styles.border,
        style]}
      >
        <Image
          source={avatar}
          resizeMode={'contain'}
          style={[{ width: size, height: size }]}
        />
      </View>
    </TouchableOrNonTouchable>
  );
};

UserAvatar.propTypes = {
  avatarUrl: PropTypes.any,
  containerStyle: View.propTypes.style,
  size: PropTypes.number,
  addBorder: PropTypes.bool,
  onPress: PropTypes.func,
  style: Image.propTypes.style,
  iconStyle: PropTypes.object,
};

UserAvatar.defaultProps = {
  size: 100,
  addBorder: false,
};
