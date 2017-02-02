import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { LIGHT_GRAY } from 'AppColors';
const dimensions = (WINDOW_WIDTH / 3 - 3);

const styles = StyleSheet.create({
  container: {
    marginLeft: 2,
    marginTop: 2,
    height: dimensions,
    width: dimensions,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    height: dimensions,
    width: dimensions,
    backgroundColor: LIGHT_GRAY
  },
});


export function PostTile({ imageUrl, routeToFeedItem, style, deletePost }) {
  return (
    <TouchableOpacity
      onPress={routeToFeedItem}
      onLongPress={deletePost}
      style={[styles.container, style]}
    >
      <View style={styles.row}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.image} />
        )}
      </View>
    </TouchableOpacity>
  );
}

PostTile.propTypes = {
  imageUrl: PropTypes.string,
  routeToFeedItem: PropTypes.func,
  deletePost: PropTypes.func,
  style: View.propTypes.style,
};
