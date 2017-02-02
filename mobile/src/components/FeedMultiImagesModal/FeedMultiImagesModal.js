import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SwipeImages } from './SwipeImages';
import { WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});


export class FeedMultiImagesModal extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    pageIndex: PropTypes.number.isRequired,
    votedImage: PropTypes.bool.isRequired,
    voteImageCount: PropTypes.number.isRequired,
    routeBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentRoute: 'SwipeView',
      showShareView: false,
      currentImage: props.images[props.pageIndex],
      tagsActive: false,
    };
    this.onImageSwiped = ::this.onImageSwiped;
    this.activateTags = ::this.activateTags;
  }

  onImageSwiped(currentImage) {
    this.setState({ currentImage });
  }

  activateTags() {
    this.setState({ tagsActive: !this.state.tagsActive });
  }

  render() {
    const { images, pageIndex, routeBack } = this.props;
    return (
      <View style={styles.container}>
        <SwipeImages
          images={images}
          tagsActive={this.state.tagsActive}
          pageIndex={pageIndex}
          onSwipe={this.onImageSwiped}
          routeBack={routeBack}
          activateTags={this.activateTags}
        />
      </View>
    );
  }
}
