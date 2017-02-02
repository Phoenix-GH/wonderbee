import React, { Component, PropTypes } from 'react';
import { View, Image, Text } from 'react-native';
import { getStyles, getDimensions } from '../styles';
import { TouchableOrNonTouchable } from 'AppComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'react-native-fetch-blob';

export class HexagonImage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      imageWidth: null,
      imageHeight: null,
      isLoading: true,
      error: null,
    };
    this.styles = getStyles(props);
  }

  async componentWillMount() {
    try {
      await this.prefetchImage();
      const { width: imageWidth, height: imageHeight } = await this.getImageSize();
      if (!this.willUnmount) {
        this.setState({ imageWidth, imageHeight, isLoading: false });
      }
    } catch (error) {
      if (!this.willUnmount) {
        this.setState({ error, isLoading: false });
      }
    }
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  getImageSize() {
    return new Promise((resolve, reject) => {
      const { imageSource } = this.props;
      if (!imageSource || !imageSource.uri) {
        return resolve({ width: null, height: null });
      }
      return Image.getSize(imageSource.uri, (width, height) => {
        const ratio = width < height ? this.getImageRatio(width) : this.getImageRatio(height);
        resolve({ width: width * ratio, height: height * ratio });
      }, error => {
        reject(error);
      });
    });
  }

  getImageRatio(imageHeight) {
    const { hexagonHeight, hexagonWidth } = getDimensions(this.props);
    return hexagonHeight > hexagonWidth ? hexagonHeight / imageHeight : hexagonWidth / imageHeight;
  }

  getImageFromUri(uri) {
    // eslint-disable-next-line max-len
    if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(uri)) return Promise.reject('Wrong url!');
    return RNFetchBlob.fetch('GET', uri).then(data =>
      `data:${data.respInfo.headers['Content-Type']};base64,${data.base64()}`);
  }

  prefetchImage() {
    const { imageSource } = this.props;
    if (!imageSource || !imageSource.uri) {
      return Promise.resolve();
    }
    return this.getImageFromUri(imageSource.uri).then(image => {
      this.props.imageSource.uri = image;
    });
  }

  renderLoading() {
    return (
      <View style={this.props.style}>
        <View style={this.styles.hexagon}>
          <View style={this.styles.textContainer}>
            <Text style={[this.styles.text, this.styles.loading]}>
              <Icon name="image" size={this.styles.textContainer.height} />
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderError() {
    const { onPress } = this.props;
    return (
      <View style={this.props.style}>
        <TouchableOrNonTouchable style={this.styles.hexagon} onPress={onPress} >
          <View style={this.styles.textContainer}>
            <Text style={[this.styles.text, this.styles.error]}>
              <Icon name="broken-image" size={this.styles.textContainer.height} />
            </Text>
          </View>
        </TouchableOrNonTouchable>
      </View>
    );
  }

  renderHexagon() {
    const {
      imageSource,
      imageWidth,
      imageHeight,
      imagePadding,
      text,
      textColor,
      opacity,
      style,
      borderColor,
      onImageLoad,
      onPress,
      size,
      isBottomText,
    } = this.props;
    return (
      <View style={style} pointerEvents="box-none">
        <View
          style={[
            this.styles.hexagon,
            opacity ? { opacity } : {},
          ]}
          pointerEvents="box-none"
        >
          {[1, 2, 3].map((rectangleNumber, i) => (
            <View
              key={rectangleNumber}
              style={[
                this.styles.rectangle,
                this.styles[`rectangle${rectangleNumber}`],
              ]}
            >
              {imageSource && (
                <Image
                  source={imageSource}
                  resizeMode="contain"
                  resizeMethod={'resize'}
                  style={[
                    this.styles[`rectangle${rectangleNumber}Content`],
                    {
                      width: this.state.imageWidth || imageWidth,
                      height: this.state.imageHeight || imageHeight,
                      padding: imagePadding,
                    },
                  ]}
                  onLoad={onImageLoad}
                />
              )}
              {i === 1 && isBottomText ? <TouchableOrNonTouchable
                style={{
                  height: 50,
                  position: 'absolute',
                  bottom: 0,
                  width: size,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
                onPress={onPress}
              /> : null}
              {i === 2 && isBottomText ? <TouchableOrNonTouchable
                style={{
                  position: 'absolute',
                  transform: [{ rotate: '-30deg' }, { translateX: -size / 2 + 6, }],
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
                onPress={onPress}
              /> : null }
              {i === 0 && isBottomText ? <TouchableOrNonTouchable
                style={{
                  position: 'absolute',
                  transform: [{ rotate: '30deg' }, { translateX: size / 2 - 6 }],
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
                onPress={onPress}
              /> : null
              }
              {i === 2 ? <View /> : null}
            </View>
          ))}
          {/* To support borders, rectangles needs to be drawn again */}
          {[1, 2, 3].map(rectangleNumber => (
            <TouchableOrNonTouchable
              key={rectangleNumber}
              style={[
                this.styles.rectangle,
                this.styles[`rectangle${rectangleNumber}`],
                borderColor ? { borderColor } : {},
              ]}
              onPress={onPress}
            />
          ))}
          {text && (
            <TouchableOrNonTouchable
              style={isBottomText ? this.styles.bottomTextContainer : this.styles.textContainer}
              onPress={onPress}
            >
              <Text
                style={[
                  this.styles.text,
                  textColor ? { color: textColor } : {}
                ]}
              >
                {text}
              </Text>
            </TouchableOrNonTouchable>
          )}
        </View>
      </View>
    );
  }

  render() {
    const { isLoading, error } = this.state;
    if (isLoading) {
      return this.renderLoading();
    }
    if (error) {
      return this.renderError();
    }
    return this.renderHexagon();
  }
}

HexagonImage.defaultProps = {
  textWeight: '500',
  imageSource: require('img/images/default_image.png'),
};

HexagonImage.propTypes = {
  imageSource: PropTypes.any,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imagePadding: PropTypes.number,
  text: PropTypes.string,
  textWeight: PropTypes.string,
  textSize: PropTypes.number,
  textColor: PropTypes.string,
  size: PropTypes.number.isRequired,
  isHorizontal: PropTypes.bool,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  opacity: PropTypes.number,
  style: View.propTypes.style,
  onImageLoad: PropTypes.func,
  onPress: PropTypes.func,
  isBottomText: PropTypes.bool,
};
