import React, { PropTypes } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { AuxText } from 'AppFonts';
import { WHITE } from 'AppColors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  margin: {
    marginTop: 5,
  },
  icon: {
    top: -20,
    width: 18.8,
    height: 15.6,
    tintColor: WHITE,
  },
  circle: {
    position: 'absolute',
    height: 18,
    width: 18,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 9,
    right: 4,
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function AvatarEdit({ style, avatarUrl, onPress, text, upperCase, onRemove }) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
    >
      <UserAvatar avatarUrl={avatarUrl} onPress={onPress} />
      {!!avatarUrl && <TouchableOpacity style={styles.circle} onPress={onRemove}>
        <Icon name="clear" size={15} color={'white'} />
      </TouchableOpacity> }
      <Image
        style={styles.icon}
        source={require('img/icons/icon_insert_image.png')}
      />
      {text && <AuxText style={styles.margin} upperCase={upperCase}>{text}</AuxText>}
    </TouchableOpacity>
  );
}

AvatarEdit.propTypes = {
  style: View.propTypes.style,
  avatarUrl: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  text: PropTypes.string,
  upperCase: PropTypes.bool,
};

AvatarEdit.defaultProps = {
  text: 'Change Photo',
  upperCase: true,
};
