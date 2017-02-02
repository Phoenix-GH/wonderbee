import React, { PropTypes } from 'react';
import { View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { HexagonImage } from 'AppComponents';
import { GrayHeader } from 'AppFonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DARK_GRAY, GRAY } from 'AppColors';
import { styles } from './styles';

export function Colony({ colony, routeCopy, style, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, styles.row, style]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <HexagonImage
          imageSource={colony.avatarUrl ? { uri: colony.avatarUrl } : undefined}
          size={50}
          imageHeight={75}
          imageWidth={75}
          isHorizontal={true}
        />
        <View style={styles.name}>
          <GrayHeader>{colony.name}</GrayHeader>
        </View>
      </View>
      <TouchableHighlight
        style={styles.button}
        onPress={routeCopy}
        underlayColor={GRAY}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View>
          <Icon name="content-copy" color={DARK_GRAY} size={25} style={styles.settings} />
        </View>
      </TouchableHighlight>
    </TouchableOpacity>
  );
}

Colony.propTypes = {
  colony: PropTypes.object.isRequired,
  routeCopy: PropTypes.func.isRequired,
  style: View.propTypes.style,
  onPress: PropTypes.func,
};
