import React, { Component, PropTypes } from 'react';
import {
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  Alert,
  LayoutAnimation,
  ImageStore,
  StyleSheet,
} from 'react-native';
import update from 'react-addons-update';
import RNViewShot from 'react-native-view-shot';
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash';
import { connectFeathers } from 'AppConnectors';
import {
  OptionsBar,
  SearchOverlay,
  Geolocation,
  PostImage,
  FilterBar,
  TextBar,
  TextInputOverlay,
  ImageFilterBar,
  PostDoneModal,
  Loading,
} from 'AppComponents';
import { POST_SERVICE } from 'AppServices';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { LabelText, TextBold } from 'AppFonts';
import { PRIMARY_TEXT, WHITE } from 'AppColors';
import { imageContainerDims } from './utilities';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    top: 20,
  },
  wrapLoading: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: WHITE,
    fontSize: 20,
    marginTop: 10,
  },
  container: {
    flexWrap: 'wrap',
    height: WINDOW_WIDTH * 4 / 3,
    width: WINDOW_WIDTH,
    overflow: 'hidden'
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
  },
  button: {
    height: 50,
    width: WINDOW_WIDTH / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twin: {
    width: WINDOW_WIDTH / 2,
  },
  geolocation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 4 / 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  input: {
    width: WINDOW_WIDTH - 20,
    borderRadius: 6,
    backgroundColor: WHITE,
    color: PRIMARY_TEXT,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    height: 35,
    paddingHorizontal: 15,
  },
  rowStyle: {
    flexDirection: 'row',
    // paddingLeft: 20,
    width: WINDOW_WIDTH,
    paddingVertical: 5,
    alignItems: 'center',
  },
  trash: {
    position: 'absolute',
    top: WINDOW_WIDTH * 4 / 3 - 40,
    right: 10,
    height: 37.5,
    width: 30,
  }
});

class PhotoEditContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    replaceCurrentScene: PropTypes.func.isRequired,
    resetRouteStack: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    updateImage: PropTypes.func.isRequired,
    removeAllImages: PropTypes.func.isRequired,
    addPreviewImage: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      images: _.cloneDeep(props.images),
      layout: 'vertical',
      optionSelected: '',
      touchable: false,
      renderOverlay: false,
      renderModal: false,
      textFilter: '',
      filterSelected: '',
      filterTemp: 0,
      textInput: { size: { height: 0, width: 0 }, text: '' },
      renderLoading: false,
      hasEditIcon: true,
    };
    this.toggleOptions = ::this.toggleOptions;
    this.toggleSlider = ::this.toggleSlider;
    this.toggleModalVisible = ::this.toggleModalVisible;
    this.handlePress = ::this.handlePress;
    this.renderImages = ::this.renderImages;
    this.renderOptions = ::this.renderOptions;
    this.renderNavBar = ::this.renderNavBar;
    this.renderSearchOverlay = ::this.renderSearchOverlay;
    this.growImage = ::this.growImage;
    this.setImageFilter = ::this.setImageFilter;
    this.setTextFilter = ::this.setTextFilter;
    this.selectResult = ::this.selectResult;
    this.selectLocation = ::this.selectLocation;
    this.onChangeText = ::this.onChangeText;
    this.updateImageState = ::this.updateImageState;
    this.savePosition = ::this.savePosition;
    this.removeWithId = ::this.removeWithId;
    this.cancel = ::this.cancel;
    this.post = ::this.post;
    this.onBlur = ::this.onBlur;
    this.saveImage = ::this.saveImage;
    this.setNewFilterValue = ::this.setNewFilterValue;
    this.takeSnapShot = ::this.takeSnapShot;
    this.rotateImage = ::this.rotateImage;
    this.searchOverlay = null;
    this.waitForAnimation = null;
    this.locationTag = {};
    this.imagePanResponder = {};
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.state.touchable,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderRelease: this.handlePress,
    });
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    LayoutAnimation.easeInEaseOut();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    if (this.waitForAnimation) {
      clearTimeout(this.waitForAnimation);
    }
  }

  onChangeText(event) {
    const textInput = {
      size: event.nativeEvent.contentSize,
      text: event.nativeEvent.text,
    };
    this.setState({ textInput });
  }

  onBlur() {
    const { images, textInput, textFilter } = this.state;
    const newState = { renderOverlay: false, textFilter: '' };
    if (textInput.text.length > 0) {
      textInput.filterType = textFilter;
      textInput.initialY = WINDOW_WIDTH * 4 / 6 - textInput.size.height / 2;
      textInput.initialX = WINDOW_WIDTH / 2;
      textInput.id = images[0].textOverlays ? images[0].textOverlays.length : 0;
      images[0].textOverlays =
        images[0].textOverlays && images[0].textOverlays.concat(textInput) || [textInput];
      newState.images = [images[0]];
    }
    this.setState(newState);
  }

  setTextFilter(textFilter) {
    this.setState({ textFilter, renderOverlay: true, touchable: false });
  }

  setImageFilter(filter) {
    const newImages = this.state.images[0];
    newImages.filter = filter;
    this.setState({ images: [newImages] });
  }

  setNewFilterValue(value, label) {
    if (label === 'detail') {
      return this.setState({
        images: update(this.state.images, { 0: { imageFilters: {
          detail: {
            $set: {
              contrast: value / 3,
              sharpen: value,
              saturation: value / 10,
              value,
            }
          } } }
        }),
      });
    }
    return this.setState({
      images: update(this.state.images, { 0: { imageFilters: {
        [label]: {
          $set: value
        } } }
      }),
    });
  }

  rotateImage() {
    this.setState({
      images: update(this.state.images, { 0:
        { imageFilters: { rotate: { $apply: x => `${(parseInt(x, 10) + 90) % 360}deg` } } },
      })
    });
  }

  cancel() {
    if (this.state.images.length === this.props.images.length) {
      return Alert.alert(
        'Are you sure you want to exit?',
        'You will lose all of your progress',
        [
          { text: 'Cancel', onPress: () => null },
          { text: 'Confirm', onPress: () =>
            this.props.removeAllImages()
            .then(() => this.props.replaceCurrentScene('CameraScene'))
          },
        ]
      );
    }

    return this.setState({
      images: _.cloneDeep(this.props.images)
    });
  }

  post({ description, visibility, voting, emojiIds, expiresAt }) {
    const { feathers } = this.props;
    const { layout } = this.state;
    this.setState({ renderModal: false, renderLoading: true }, () => {
      const keys = Object.keys(this).filter(k => k.indexOf('postImage') === 0);
      const promises = [];
      const isSingleImage = this.props.images.length === 2;
      const images = isSingleImage ? [] : [this.props.images.filter(img => img.order === 0)[0]];
      const convertBase64 = (image) => new Promise(resolve =>
        ImageStore.getBase64ForTag(image, uri =>
          resolve(`data:image/jpg;base64,${uri}`), (error) => console.log(error)
        )
      );
      for (let i = 0; i < keys.length; i++) {
        if (this.props.images.length > 2 && keys[i] === 'postImage') {
          continue;
        }
        const innerSurface = this[keys[i]].getSurface();
        const captureProperties = isSingleImage ?
          this.postImage.getSurface().surface.getPanAndScale() :
          { pan: innerSurface.image.pan, scale: innerSurface.image.scale };
        const scaledWidth = captureProperties.scale * innerSurface.image.size.width;
        const scaledHeight = captureProperties.scale * innerSurface.image.size.height;
        const textOverlays = innerSurface.image.textOverlays.map(text => {
          const pan = { ...text.pan };
          if (scaledWidth < WINDOW_WIDTH) {
            pan.x -= (WINDOW_WIDTH - scaledWidth) / 2 *
              innerSurface.image.size.width / WINDOW_WIDTH;
          }
          if (scaledHeight < WINDOW_WIDTH * 4 / 3) {
            pan.y -= (WINDOW_WIDTH * 4 / 3 - scaledHeight) / 2 *
              innerSurface.image.size.height / (WINDOW_WIDTH * 4 / 3);
          }
          return {
            ...text,
            pan,
            scale: text.scale ? text.scale : 1,
            rotate: text.rotate ? text.rotate : '0deg'
          };
        });
        const tags = innerSurface.image.tags.map(tag => {
          const imageTag = { ...tag };
          if (scaledWidth < WINDOW_WIDTH) {
            imageTag.x -= (WINDOW_WIDTH - scaledWidth) / 2 *
              innerSurface.image.size.width / WINDOW_WIDTH;
          }
          if (scaledHeight < WINDOW_WIDTH * 4 / 3) {
            imageTag.y -= (WINDOW_WIDTH * 4 / 3 - scaledHeight) / 2 *
              innerSurface.image.size.height / (WINDOW_WIDTH * 4 / 3);
          }
          return {
            ...tag,
            ...imageTag,
            scale: tag.scale ? tag.scale : 1
          };
        });
        const objectToSet = Object.assign({},
          innerSurface.image,
          {
            order: isSingleImage ? 0 : innerSurface.image.order,
            textOverlays,
            tags
          }
        );
        promises.push(
          innerSurface.surface.captureFrameAndCrop(captureProperties)
          .then(img => convertBase64(img))
          .then(img => images.push({ ...objectToSet, snappedSurface: img }))
          .catch(error => console.log(error))
        );
      }
      return Promise.all(promises)
      .then(() => {
        const newPost = {
          images,
          description,
          visibility,
          voting,
          emojiIds,
          layout,
          expiresAt,
        };
        this.props.resetRouteStack(2, { newPostExpected: true, resetFeed: true });
        return feathers.service(POST_SERVICE).create(newPost);
      })
      .catch(error => console.log(error));
    });
  }

  takeSnapShot() {
    return RNViewShot.takeSnapshot(this.imageWrap, {
      format: 'jpeg',
      quality: 1,
      result: 'data-uri',
      width: 1080,
    });
  }

  updateImageState(images = this.state.images) {
    const properties = this.postImage.getSurface().surface.getPanAndScale();
    const imageProps = Object.assign({}, images[0], properties);
    return this.props.updateImage(imageProps.order, imageProps);
  }

  selectLocation(response) {
    const newState = {
      renderOverlay: false,
      optionSelected: '',
      touchable: false,
    };
    if (response) {
      const { result } = response;
      const { images } = this.state;
      const { lat: latitude, lng: longitude } = result.geometry.location;
      const { name } = result;
      images[0].location = { latitude, longitude, name };
      newState.images = [images[0]];
    }
    this.setState(newState, () => this.updateImageState());
  }

  handlePress(event, gestureState) {
    const { x0, y0 } = gestureState;
    switch (this.state.optionSelected) {
      case 'tag': {
        this.locationTag = { x: x0, y: y0 };
        this.setState({ renderOverlay: true });
        break;
      }
      default:
        break;
    }
  }

  savePosition(option) {
    return this.postImage.getImage(option);
  }

  removeWithId(id, type) {
    const images = this.state.images
    .map(img => ({ ...img, [type]: img[type].filter(item => item.id !== id) }));
    this.setState({ images });
  }

  growImage(image) {
    const imageLength = this.state.images.filter(img => img.order !== 0).length;
    const keys = Object.keys(this).filter(k => k.indexOf('postImage') === 0);
    for (let i = 0; i < keys.length; i++) {
      if (this.props.images.length > 1 && keys[i] === 'postImage') {
        continue;
      }
      this[keys[i]].animateOut(image.order, this.state.layout, imageLength);
    }
    this.waitForAnimation = setTimeout(() => {
      this.waitForAnimation = null;
      this.setState({ images: [image], touchable: false });
    }, 500);
  }

  selectResult(id, username) {
    const { images } = this.state;
    const newState = {
      renderOverlay: false,
    };
    if (username) {
      let newId = id;
      if (id === 0) {
        newId = images[0].tags ? id + images[0].tags.length / 100 : id;
      }
      const tag = {
        id: newId,
        username,
        initialX: this.locationTag.x,
        initialY: this.locationTag.y,
      };
      images[0].tags = images[0].tags && images[0].tags.concat(tag) || [tag];
      newState.images = [images[0]];
    }
    this.setState(newState, () => this.locationTag = {});
  }

  toggleSlider(filterSelected) {
    const { imageFilters } = this.state.images[0];
    this.setState({ filterSelected, filterTemp: imageFilters[filterSelected.toLowerCase()] });
  }

  toggleOptions(optionSelected) {
    const { renderOverlay, optionSelected: prevOption } = this.state;
    if (renderOverlay &&
      (
        (prevOption === 'tag' && optionSelected === 'location') ||
        (prevOption === 'location' && optionSelected === 'tag')
      )
    ) {
      this.searchOverlay.getWrappedInstance().getTextRef().clear();
    }
    if (optionSelected === prevOption) {
      this.setState({ optionSelected: '', touchable: false, renderOverlay: false });
    } else {
      this.setState({
        optionSelected,
        touchable: optionSelected === 'tag',
        renderOverlay: optionSelected === 'location',
      });
    }
  }

  toggleModalVisible(renderModal = false) {
    this.setState({ renderModal });
  }

  saveImage() {
    return this.updateImageState(this.state.images)
    .then(() => (
      this.state.images.length === this.props.images.length &&
      this.setState({ images: _.cloneDeep(this.props.images) })
    ));
  }

  renderSearchOverlay() {
    const { optionSelected, textFilter } = this.state;
    if (optionSelected === 'tag') {
      return (
        <SearchOverlay
          ref={search => this.searchOverlay = search}
          onPress={this.selectResult}
        />
      );
    }
    if (optionSelected === 'text') {
      return (
        <TextInputOverlay
          textFilter={textFilter}
          onChange={this.onChangeText}
          onBlur={this.onBlur}
        />
      );
    }
    return (
      <Geolocation
        inputOptions={{
          placeholder: 'Search for a location',
          autoFocus: true,
          autoCapitalize: 'none',
          autoCorrect: false,
          underlineColorAndroid: 'transparent',
        }}
        inputStyle={styles.input}
        containerStyle={styles.geolocation}
        searchType="combination"
        rowStyle={styles.rowStyle}
        rowTextStyle={styles.rowTextStyle}
        currentLocationText={'My Location'}
        nearby={true}
        onSelect={this.selectLocation}
        allowsEmpty={true}
      />
    );
  }

  renderImages() {
    const { images: allImages, layout, optionSelected, imageFilters, hasEditIcon } = this.state;
    const images = allImages.filter(img => img.order !== 0);
    const height = WINDOW_WIDTH * 4 / 3;
    const width = WINDOW_WIDTH;
    const flexDirection = layout === 'vertical' ? 'column' : 'row';
    const { height: calHeight, width: calWidth } = imageContainerDims(images.length, layout);
    return images.length === 1 ? (
      <PostImage
        ref={ref => this.postImage = ref}
        height={height}
        width={width}
        image={images[0]}
        optionSelected={optionSelected}
        removeWithId={this.removeWithId}
        renderWithInitial={true}
        {...imageFilters}
      />
    ) : (
      <View style={[styles.container, { flexDirection }]}>
        {images.sort((img1, img2) =>
          (img1.order < img2.order ? -1 : 1)
        ).map((image, index) => (
          <PostImage
            key={index}
            ref={ref => this[`postImage${index}`] = ref}
            height={calHeight}
            width={calWidth}
            image={image}
            optionSelected={optionSelected}
            removeWithId={this.removeWithId}
            requiresMinScale={true}
            hasEditIcon={hasEditIcon}
            editIconAction={this.growImage}
            {...imageFilters}
          />
        ))}
      </View>
    );
  }

  renderOptions() {
    const { optionSelected, images, textFilter, layout, filterSelected } = this.state;
    if (images.filter(img => img.order !== 0).length > 1) {
      return (
        <OptionsBar
          toggleOptions={newLayout => this.setState({ layout: newLayout })}
          toggle={layout}
          imageLength={images.filter(img => img.order !== 0).length}
        />
      );
    }
    switch (optionSelected) {
      case 'tag': {
        return (
          <OptionsBar toggleOptions={this.toggleOptions} toggle="tag" />
        );
      }
      case 'location': {
        return (
          <OptionsBar toggleOptions={this.toggleOptions} toggle="location" />
        );
      }
      case 'filter': {
        return (
          <FilterBar setImageFilter={this.setImageFilter} filterImage={images[0]} />
        );
      }
      case 'text': {
        return (
          <TextBar textFilter={textFilter} setTextFilter={this.setTextFilter} />
        );
      }
      case 'edit': {
        return (
          <ImageFilterBar
            toggleSlider={this.toggleSlider}
            showSlider={filterSelected !== ''}
            label={filterSelected}
            setNewFilterValue={this.setNewFilterValue}
            rotateImage={this.rotateImage}
            {...images[0].imageFilters}
          />
        );
      }
      default: {
        return (
          <OptionsBar toggleOptions={this.toggleOptions} />
        );
      }
    }
  }

  renderNavBar() {
    const { replaceCurrentScene } = this.props;
    const { filterSelected, optionSelected } = this.state;
    const cancelImage = this.props.images.filter(img => img.order === this.state.images[0].order);
    const sameLength = this.props.images.length === this.state.images.length;
    const options1 = [
      { label: 'Cancel', onPress: () => {
        if (filterSelected) {
          return this.setState({
            filterSelected: '',
            images: update(this.state.images, { 0: { imageFilters: {
              [filterSelected.toLowerCase()]: { $set: this.state.filterTemp }
            } } }),
          });
        }
        this.toggleOptions(optionSelected);
        if (this.props.images.length === this.state.images.length) {
          return this.setState({ images: _.cloneDeep(this.props.images) });
        }
        return this.setState({ images: cancelImage });
      } },
      { label: 'Save', onPress: () => {
        if (filterSelected) {
          return this.setState({ filterSelected: '' });
        }
        this.toggleOptions(optionSelected);
        if (sameLength) {
          const images = this.savePosition(optionSelected);
          return this.setState({ images }, this.saveImage);
        } else if (optionSelected === 'text' || optionSelected === 'tag') {
          const images = this.savePosition(optionSelected);
          return this.setState({ images });
        }
        return null;
      } },
    ];
    const options2 = [
      { label: 'Exit', onPress: this.cancel },
      // eslint-disable-next-line max-len
      { label: sameLength ? 'Next' : 'Save', onPress: () => {
        if (sameLength) {
          this.setState({ hasEditIcon: false }, () =>
            this.takeSnapShot()
            .then(image => this.props.addPreviewImage(image))
            .then(() => {
              this.setState({ images: _.cloneDeep(this.props.images), hasEditIcon: true });
              this.toggleModalVisible(true);
            })
          );
        } else {
          this.saveImage()
          .then(() =>
            this.setState({ images: _.cloneDeep(this.props.images) })
          );
        }
      } },
    ];
    if (sameLength && this.props.images.length < 4) {
      options2.splice(1, 0, {
        label: require('img/icons/icon_add_new_image.png'),
        style: { width: 35, height: 35 },
        onPress: () => replaceCurrentScene('CameraScene', { backTo: 'PhotoEditScene' }),
        icon: true
      });
    }
    const arrayToRender = this.state.optionSelected === '' ? options2 : options1;
    return (
      <View style={styles.navbar}>
        {arrayToRender.map((item, index, array) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={[styles.button, array.length === 2 && styles.twin]}
          >
            {item.icon ? (
              <Image source={item.label} style={item.style} />
            ) : (
              <LabelText>{item.label}</LabelText>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  render() {
    const {
      renderOverlay,
      optionSelected,
      renderModal,
      renderLoading,
    } = this.state;
    const previewImage = this.props.images.filter(img => img.order === 0)[0];
    return (
      <View style={styles.wrap}>
        <View ref={ref => this.imageWrap = ref} {...this.imagePanResponder.panHandlers}>
          {this.renderImages()}
        </View>
        {this.renderOptions()}
        {this.renderNavBar()}
        {renderOverlay && this.renderSearchOverlay()}
        {(optionSelected === 'text' || optionSelected === 'tag') && (
          <Image source={require('img/icons/icon_delete.png')} style={styles.trash} />
        )}
        <PostDoneModal
          render={renderModal}
          numberOfImages={this.props.images.filter(img => img.order !== 0).length}
          previewImage={previewImage}
          toggleVisible={this.toggleModalVisible}
          post={this.post}
        />
        {renderLoading && (
          <View style={styles.wrapLoading}>
            <Loading color={WHITE} />
            <TextBold style={styles.loadingText}>Posting...</TextBold>
          </View>
        )}
      </View>
    );
  }
}

export default connectFeathers(PhotoEditContainer);
