import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { HexagonImage } from 'AppComponents';
import { styles } from './styles';

export class ColonyPost extends Component {
  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    }).isRequired,
    style: View.propTypes.style,
    onViewPress: PropTypes.func,
  }

  render() {
    const { post, style, onViewPress } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.subtitle}>{post.subtitle}</Text>
        <HexagonImage
          imageSource={{ uri: post.imageUrl }}
          size={WINDOW_WIDTH * 0.7}
          borderWidth={2}
          borderColor="white"
        />
        <TouchableOpacity onPrwss={onViewPress}>
          <Text style={styles.viewButton}>VIEW POST</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
