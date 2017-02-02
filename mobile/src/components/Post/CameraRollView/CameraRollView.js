import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  Image,
  CameraRoll,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import {
  Loading
} from 'AppComponents';
import { AlertMessage } from 'AppUtilities';
import { styles } from './styles';

export class CameraRollView extends Component {
  static propTypes = {
    addImage: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    assetType: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      images: [],
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => (
        row1.uri !== row2.uri ||
        row1.selected !== row2.selected
      ) }).cloneWithRows([]),
      loading: true,
    };
    this.storeImages = ::this.storeImages;
    this.fetchImages = ::this.fetchImages;
    this.chooseImage = ::this.chooseImage;
    this.nextImages = ::this.nextImages;
    this.renderSelected = ::this.renderSelected;
    this.renderImage = ::this.renderImage;
    this.fetchParams = {
      first: 25,
      after: undefined,
      assetType: props.assetType
    };

    this.firstTime = true;
  }

  componentDidMount() {
    this.getImages();
  }

  componentDidUpdate() {
    this.getImages();
  }

  getImages() {
    if (this.firstTime && this.props.visible) {
      this.firstTime = false;
      InteractionManager.runAfterInteractions(() => {
        this.fetchImages();
      });
    }
  }

  storeImages(data) {
    const assets = data.edges;
    const images = assets.map((asset) => asset.node.image);
    const { dataSource, images: existingImages } = this.state;
    const newImageCollection = existingImages.concat(images);
    this.setState({
      loading: false,
      dataSource: dataSource.cloneWithRows(newImageCollection),
      images: newImageCollection,
    });
  }

  nextImages({ nativeEvent }) {
    const { contentOffset, contentInset } = nativeEvent;
    if (contentOffset.y > contentInset.top) {
      const { images } = this.state;
      const lastImage = images[images.length - 1];
      if (this.fetchParams.after !== lastImage.uri) {
        this.fetchParams.after = lastImage.uri;
        this.fetchImages();
      }
    }
  }

  fetchImages() {
    CameraRoll.getPhotos(this.fetchParams)
    .then(this.storeImages)
    .catch(error => (
      this.setState({ loading: false }, () => AlertMessage.fromRequest(error))
    ));
  }

  chooseImage(chosenImage) {
    const { images, dataSource } = this.state;
    const { images: propsImages } = this.props;

    const mappedImages = images.map(image => ({ ...image, selected: !image.selected }));
    const shouldRemove = propsImages.filter(img => img.uri === chosenImage.uri).length > 0;
    if (shouldRemove) {
      return this.setState({
        images: mappedImages,
        dataSource: dataSource.cloneWithRows(mappedImages)
      }, () => (
        this.props.removeImage(chosenImage)
      ));
    }
    const image = {
      uri: chosenImage.uri,
      size: {
        height: chosenImage.height,
        width: chosenImage.width,
      },
    };
    return this.props.addImage(image);
  }

  renderSelected(image) {
    const { images } = this.props;
    return images.filter(img => img.uri === image.uri).length > 0 &&
      <View style={styles.imageSelected} />;
  }

  renderImage(image, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.chooseImage(image)}
        style={styles.image}
      >
        <Image
          style={[styles.image, styles.imageImage]}
          source={{ uri: image.uri }}
          resizeMode={'cover'}
          resizeMethod={'resize'}
        />
        {this.renderSelected(image)}
      </TouchableOpacity>
    );
  }

  render() {
    const { images, loading, dataSource } = this.state;
    return this.props.visible ? (
      <View style={styles.cameraRoll}>
        {loading ? (
          <View style={styles.center}>
            <Loading />
          </View>
        ) : (
          <ListView
            bounces={false}
            scrollEventThrottle={5}
            onScroll={this.nextImages}
            dataSource={dataSource}
            renderRow={this.renderImage}
            contentContainerStyle={styles.imageGrid}
            pageSize={3}
          />
        )}
      </View>
    ) : (
      <View></View>
    )
  }
}
