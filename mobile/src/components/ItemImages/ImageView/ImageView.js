import React, { Component, PropTypes } from 'react';
import { PanResponder, Image, View } from 'react-native';
import { Heatmap } from 'AppComponents';
import { ItemImageTitle } from 'AppFonts';
import { styles } from './styles';
import { CLICK_DURATION } from '../constants';

export class ImageView extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    image: PropTypes.object.isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    fromCommentContainer: PropTypes.bool,
    hasHeatMap: PropTypes.bool.isRequired,
    multiImageView: PropTypes.bool.isRequired,
    selectImage: PropTypes.func,
    voteImage: PropTypes.func,
    votedImage: PropTypes.bool,
    voteData: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      showHeatMap: false,
      data: props.image.votedPosition,
    };
    this._panResponder = {};
    this.selectTimeout = null;
    this._onPanResponderRelease = ::this._onPanResponderRelease;
    this.renderHeatmap = ::this.renderHeatmap;
    this.doubleTapImage = ::this.doubleTapImage;
    this.singleTapImage = ::this.singleTapImage;
    this.renderImage = ::this.renderImage;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderRelease: this._onPanResponderRelease
    });
  }

  componentWillUnmount() {
    if (this.selectTimeout) {
      clearTimeout(this.selectTimeout);
    }
  }

  doubleTapImage(left, top) {
    const { hasHeatMap, voteImage, image } = this.props;
    if (hasHeatMap) {
      this.setState({
        showHeatMap: true,
        data: this.state.data.concat({ left, top }),
      });
      return voteImage(image.id, { left, top }, true);
    }
    return voteImage(image.id);
  }

  singleTapImage() {
    const { hasHeatMap, selectImage, index } = this.props;
    if (!hasHeatMap && selectImage) {
      selectImage(true, index);
    }
  }

  _onPanResponderRelease(e) {
    const { locationX, locationY } = e.nativeEvent;
    if (this.selectTimeout) {
      clearTimeout(this.selectTimeout);
      this.selectTimeout = null;
      this.doubleTapImage(locationX, locationY);
    } else {
      this.selectTimeout = setTimeout(
        () => this.singleTapImage(), CLICK_DURATION
      );
    }
    return true;
  }

  renderImage() {
    const {
      containerHeight,
      containerWidth,
      image,
      initialRotate,
    } = this.props;
    if (image && image.url) {
      return (
        <Image
          source={{ uri: image.url }}
          resizeMode="cover"
          style={{
            width: containerWidth,
            height: containerHeight,
            transform: [
              { rotate: `${initialRotate}deg` }
            ]
          }}
          {...this._panResponder.panHandlers}
        />
      );
    }
    return null;
  }

  renderHeatmap(uri, width, height) {
    return (
      <Heatmap
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        width={width}
        height={height}
        imageSource={{ uri }}
        data={this.props.voteData}
      />
    );
  }

  render() {
    const {
      containerHeight,
      containerWidth,
      image,
      hasHeatMap,
      multiImageView,
      fromCommentContainer,
      votedImage,
    } = this.props;
    const { showHeatMap } = this.state;
    return (
      <View
        style={[{
          width: containerWidth,
          height: containerHeight,
        }, styles.imageContainer]}
      >
        {this.renderImage()}
        {
          (showHeatMap || fromCommentContainer || votedImage) && hasHeatMap &&
          this.renderHeatmap(image.url, containerWidth, containerHeight)
        }
      </View>
    );
  }
}
