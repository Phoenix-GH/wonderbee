import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';
import { LabelText } from 'AppFonts';
import { UserAvatar } from 'AppComponents';
export const ThreadUserRow = ({ user, handlePress, style, textStyle }) => (
  <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
    <UserAvatar
      avatarUrl={user.avatarUrl}
      size={50}
      iconStyle={{ width: 22, height: 25 }}
    />
    <LabelText style={[styles.text, textStyle]}>
      {user.name}
    </LabelText>
  </TouchableOpacity>
);

ThreadUserRow.propTypes = {
  user: PropTypes.object.isRequired,
  handlePress: PropTypes.func.isRequired,
  style: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
