import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image as RNImage } from 'react-native';
import { Image } from 'gl-react-image';
import ImageFilter from 'gl-react-imagefilters';
import { Filter, TextOverlay, Tag, ViewEditor } from 'AppComponents';
import { WHITE, GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  locationContainer: {
    backgroundColor: GRAY,
    padding: 5,
    height: 30,
    position: 'absolute',
    top: WINDOW_WIDTH * 4 / 3 - 30,
    left: 0,
  },
  locationText: {
    color: WHITE,
  },
  edit: {
    position: 'absolute',
    top: 25,
    left: 5,
  },
  icon: {
    tintColor: WHITE,
    height: 20,
    width: 21.7,
  }
});

export class PostImage extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    image: PropTypes.object.isRequired,
    optionSelected: PropTypes.string.isRequired,
    removeWithId: PropTypes.func.isRequired,
    requiresMinScale: PropTypes.bool,
    renderWithInitial: PropTypes.bool,
    hasEditIcon: PropTypes.bool,
    editIconAction: PropTypes.func,
  };

  static defaultProps = {
    requiresMinScale: false,
    renderWithInitial: false,
    hasEditIcon: false,
  };

  constructor(props, context) {
    super(props, context);
    const { width, height } = props;
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      height: new Animated.Value(height),
      width: new Animated.Value(width),
    };
    this.getSurface = ::this.getSurface;
    this.getImage = ::this.getImage;
    this.surface = null;
  }

  componentWillReceiveProps(nextProps) {
    Animated.parallel([
      Animated.timing(this.state.height, {
        toValue: nextProps.height,
        duration: 500,
      }),
      Animated.timing(this.state.width, {
        toValue: nextProps.width,
        duration: 500,
      }),
    ]).start();
  }

  getSurface() {
    const { image } = this.props;
    return { surface: this.surface, image };
  }

  getImage(option) {
    const { image: propImage } = this.props;
    const keys = Object.keys(this).filter(k => k.indexOf(option) === 0);
    const values = [];
    for (let i = 0; i < keys.length; i ++) {
      if (this[keys[i]]) {
        values.push({ ...this[keys[i]].onDone(), id: i });
      }
    }
    const overlay = option === 'text' ? 'textOverlays' : 'tags';
    const image = { ...propImage, [overlay]: values };
    return [image];
  }

  animateOut(order, layout, length) {
    const { image } = this.props;
    const toValue = {
      x: layout === 'vertical' ? WINDOW_WIDTH : 0,
      y: layout === 'horizontal' ? WINDOW_HEIGHT : 0,
    };
    if (image.order !== order) {
      if (image.order < order) {
        toValue.x *= -1;
        toValue.y *= -1;
      }
      Animated.stagger(250, [
        Animated.timing(
          this.state.pan, {
            toValue,
            duration: 500,
          },
        ),
        Animated.timing(
          this.state.scale, {
            toValue: 0,
            duration: 250,
          }
        )
      ]).start();
    } else {
      const dim = layout === 'vertical' ? this.props.width : this.props.height;
      Animated.parallel([
        Animated.timing(
          layout === 'vertical' ? this.state.width : this.state.height, {
            toValue: length * dim,
            duration: 500,
          }
        ),
        Animated.timing(
          this.state.pan, {
            toValue: {
              x: layout === 'vertical' ? this.props.width * (1 - order) : 0,
              y: layout === 'horizontal' ? this.props.height * (1 - order) : 0
            },
            duration: 500,
          }
        )
      ]).start();
    }
  }

  render() {
    const { pan, scale, height: aHeight, width: aWidth } = this.state;
    const {
      height,
      width,
      image,
      optionSelected,
      removeWithId,
      requiresMinScale,
      renderWithInitial,
      hasEditIcon,
      editIconAction,
    } = this.props;
    const style = {
      height: aHeight,
      width: aWidth,
      overflow: 'hidden',
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { scale },
      ],
    };
    const { imageFilters } = image;
    const imageFilterProps = {
      hue: imageFilters.hue || 0,
      blur: imageFilters.blur || 0,
      sepia: imageFilters.sepia || 0,
      // eslint-disable-next-line max-len
      sharpen: imageFilters.sharpen + imageFilters.detail.sharpen || 0,
      negative: imageFilters.negative || 0,
      // eslint-disable-next-line max-len
      contrast: imageFilters.contrast + imageFilters.detail.contrast || 1,
      // eslint-disable-next-line max-len
      saturation: imageFilters.saturation + imageFilters.detail.saturation || 1,
      brightness: imageFilters.brightness || 1,
      temperature: imageFilters.temperature || 6500,
    };
    const viewEditorProps = {
      ref: ref => this.surface = ref,
      imageWidth: image.size.width,
      imageHeight: image.size.height,
      imageContainerWidth: width,
      imageContainerHeight: height,
      bigContainerWidth: WINDOW_WIDTH,
      bigContainerHeight: WINDOW_WIDTH * 4 / 3,
      panning: optionSelected === '',
      croppingRequired: true,
      initialRotate: imageFilters.rotate,
      requiresMinScale,
    };

    if (renderWithInitial) {
      viewEditorProps.initialPan = image.pan;
      viewEditorProps.initialScale = image.scale;
    }

    return (
      <Animated.View style={style}>
        <ViewEditor {...viewEditorProps}>
          <ImageFilter height={image.size.height} width={image.size.width} {...imageFilterProps}>
            <Filter filter={image.filter || ''}>
              <Image
                source={image.uri}
                imageSize={{ width: image.size.width, height: image.size.height }}
              />
            </Filter>
          </ImageFilter>
        </ViewEditor>
        {hasEditIcon && (
          <TouchableOpacity onPress={() => editIconAction(image)} style={styles.edit}>
            <RNImage source={require('img/icons/icon_edit.png')} style={styles.icon} />
          </TouchableOpacity>
        )}
        {image.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {image.location.name}
            </Text>
          </View>
        )}
        {image.textOverlays && image.textOverlays.map((text, i) => (
          <TextOverlay
            key={i}
            ref={ref => this[`text${i}`] = ref}
            text={text}
            panning={optionSelected === 'text'}
            removeWithId={removeWithId}
            imageWidth={image.size.width}
            imageHeight={image.size.height}
          />
        ))}
        {optionSelected === 'tag' && image.tags && image.tags.map((tag, i) => (
          <Tag
            key={i}
            ref={ref => this[`tag${i}`] = ref}
            tag={tag}
            panning={optionSelected === 'tag'}
            removeWithId={removeWithId}
            imageWidth={image.size.width}
            imageHeight={image.size.height}
          />
        ))}
      </Animated.View>
    );
  }
}
