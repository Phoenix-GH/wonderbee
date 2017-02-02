import React, { Component, PropTypes } from 'react';
import { View, Animated, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from 'AppComponents';
import { ImageView } from './ImageView';
import { YELLOW, WHITE, BG_DARK_GRAY, BG_MEDIUM_GRAY } from 'AppColors';
import { LabelText } from 'AppFonts';
import _ from 'lodash';
import {
  CONTAINER_DIMS,
  IMAGE_DIMS,
} from './constants';

const styles = StyleSheet.create({
  iconCheckVote: {
    width: 30,
    height: 25,
    tintColor: WHITE
  },
  iconLogo: {
    width: 47,
    height: 55
  }
});


export class ItemImages extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    fromCommentContainer: PropTypes.bool,
    showHeatMap: PropTypes.bool,
    showVoteAnimation: PropTypes.bool,
    voteImageCount: PropTypes.number,
    voteImage: PropTypes.func,
    showMultiModalScreen: PropTypes.func,
    votedImage: PropTypes.bool,
    voteData: PropTypes.array,
  };

  static defaultProps = {
    voteData: []
  };

  constructor(props) {
    super(props);
    this.state = {
      activeItemFadeOutAnimation: new Animated.Value(1),
      fadeOutAnimation: new Animated.Value(0.8),
      fadeInAnimation: new Animated.Value(0),
      showDimBackground: true,
      animationFinished: false
    };
    this.voteImage = ::this.voteImage;
    this.animationTimeout = null;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.showVoteAnimation !== this.props.showVoteAnimation) {
      this.animationTimeout = setTimeout(() => {
        const keys = [
          'activeItemFadeOutAnimation',
          'fadeOutAnimation',
        ];
        const animations = [];
        keys.forEach(key =>
          animations.push(
            Animated.timing(
              this.state[key], {
                toValue: 0,
                duration: 500,
              }
            )
          )
        );
        animations.push(
          Animated.timing(
            this.state.fadeInAnimation, {
              toValue: 0.6,
              duration: 500,
            }
          )
        );
        Animated.parallel(animations).start(() => {
          this.setState({ showVoteAnimation: false, animationFinished: true });
        });
        this.setState({
          showDimBackground: true,
        });
        this.animationTimeout = null;
      }, 2000);
    }
    return true;
  }

  componentWillUnmount() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
  }

  voteImage(imageId, position, heatmap) {
    this.setState({
      showDimBackground: false
    });
    if (this.props.voteImage) {
      this.props.voteImage(imageId, position, heatmap);
    }
  }

  renderVoteStatus(index, image) {
    const {
      images,
      showVoteAnimation,
      voteImageCount,
      showMultiModalScreen
    } = this.props;
    const maxVoteCount = _.maxBy(images, (img) => img.votes).votes;
    const opacityValue = showVoteAnimation ? this.state.fadeInAnimation : 0.6;
    if (image.voted && this.state.showDimBackground) {
      const style = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 20,
        backgroundColor: BG_DARK_GRAY,
        opacity: opacityValue
      };
      const borderStyle = {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: WHITE
      };
      const textStyle = {
        color: WHITE,
        fontSize: 20,
        fontWeight: 'bold'
      };
      if (image.voted) {
        borderStyle.borderColor = YELLOW;
        borderStyle.borderWidth = 2;
      }
      if (maxVoteCount > 0 && maxVoteCount === image.voteCount) {
        textStyle.color = YELLOW;
      }
      return (
        <TouchableOpacity
          style={borderStyle}
          onPress={() => showMultiModalScreen(true, index)}
        >
          <Animated.View style={style} />
          <LabelText style={textStyle} fontSize={18}>
            {image.votes * 100 / voteImageCount}%
          </LabelText>
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderActiveVote(image, containerWidth, containerHeight) {
    const { showVoteAnimation } = this.props;
    const { activeItemFadeOutAnimation, fadeOutAnimation, animationFinished } = this.state;

    if (showVoteAnimation && !animationFinished) {
      if (image.voted) {
        const voteWidth = 60;
        return (
          <Animated.View
            style={{
              position: 'absolute',
              width: voteWidth,
              height: voteWidth,
              borderRadius: voteWidth,
              backgroundColor: YELLOW,
              left: (containerWidth - voteWidth) / 2,
              top: (containerHeight - voteWidth) / 2,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: activeItemFadeOutAnimation
            }}
          >
            <Image
              source={require('img/icons/icon_check_vote.png')}
              style={ styles.iconCheckVote }
            />
          </Animated.View>
        );
      }

      return (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'white',
            opacity: fadeOutAnimation
          }}
        />
      );
    }
    return null;
  }

  render() {
    const {
      fromCommentContainer,
      showHeatMap,
      showMultiModalScreen,
      voteData,
    } = this.props;
    const images = this.props.images.concat();
    const height = images.length <= 2 ? CONTAINER_DIMS : IMAGE_DIMS;
    const width = images.length > 1 ? IMAGE_DIMS : CONTAINER_DIMS;
    const votedImage = images.filter(img => img.voted).length > 0;
    if (images.length === 3) {
      images.push(null);
    }
    return (
      <View style={{ height: CONTAINER_DIMS, width: CONTAINER_DIMS }}>
        <Order>
          {images.map((image, index) => {
            if (image !== null) {
              const top = index <= 1 ? 0 : IMAGE_DIMS;
              const left = index % 2 === 0 ? 0 : IMAGE_DIMS;
              const onSelect = images.length > 1 ? showMultiModalScreen : null;
              return (
                <View
                  style={{ top, left, width, height, position: 'absolute' }}
                  key={index}
                >
                  <ImageView
                    order={0}
                    index={index}
                    image={image}
                    containerHeight={height}
                    containerWidth={width}
                    selectImage={onSelect}
                    voteImage={this.voteImage}
                    fromCommentContainer={fromCommentContainer}
                    hasHeatMap={images.length === 1 && showHeatMap}
                    multiImageView={images.length > 1}
                    votedImage={votedImage}
                    voteData={voteData}
                  />
                  {images.length > 1 && this.renderVoteStatus(index, image)}
                  {images.length > 1 && this.renderActiveVote(image, width, height)}
                </View>
              );
            }
            return (
              <View
                style={{
                  width,
                  height,
                  top: IMAGE_DIMS,
                  left: IMAGE_DIMS,
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: BG_MEDIUM_GRAY
                }}
                key={4}
              >
                <Image
                  source={require('img/icons/icon_logo.png')}
                  resizeMode="cover"
                  style={ styles.iconLogo }
                />
              </View>
            );
          })}
        </Order>
      </View>
    );
  }
}
