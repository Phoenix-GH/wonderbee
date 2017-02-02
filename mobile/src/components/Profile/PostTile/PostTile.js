import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { styles } from './styles';
const halfWidth = (WINDOW_WIDTH / 3 - 10) / 2;
const fullWidth = (WINDOW_WIDTH / 3 - 10);

export function PostTile({ images, routeToFeedItem }) {
  const width = images.length > 1 ? halfWidth : fullWidth;
  const height = images.length > 2 ? halfWidth : fullWidth;
  return (
    <TouchableOpacity onPress={routeToFeedItem} style={styles.container}>
      <View style={styles.row}>
        {images.map((image, i) => (
          <Image
            key={i}
            source={{ uri: image.url }}
            style={{ height, width }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

PostTile.propTypes = {
  images: PropTypes.array.isRequired,
  routeToFeedItem: PropTypes.func.isRequired,
};
