import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  Image,
  CameraRoll,
  TouchableOpacity,
  InteractionManager,
  StyleSheet,
} from 'react-native';
import Camera from 'react-native-camera';
import { AlertMessage } from 'AppUtilities';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH as width, WINDOW_HEIGHT } from 'AppConstants';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3,
    height: width / 3,
    borderWidth: 1,
    borderColor: WHITE
  },
  imageSelected: {
    position: 'absolute',
    width: width / 3,
    height: width / 3,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  cameraRoll: {
    height: WINDOW_HEIGHT - 80,
    width,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  camera: {
    position: 'absolute',
    height: WINDOW_HEIGHT,
    width,
  },
  button: {
    backgroundColor: '#000',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 2,
  },
  label: {
    color: WHITE,
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width,
  },
  navBarLabel: {
    color: WHITE,
    fontSize: 16,
  },
  bottomBar: {
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export class AvatarCameraRollContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    toggleTab: PropTypes.func.isRequired,
    imageSelected: PropTypes.func.isRequired,
    tab: PropTypes.oneOf(['Photos']),
  };

  static defaultProps = {
    tab: 'Photos',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      images: [],
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => (
        row1 !== row2 ||
        row1.selected !== row2.selected
      ) }).cloneWithRows([]),
      chosenImage: {},
    };
    this.fetchImages = ::this.fetchImages;
    this.storeImages = ::this.storeImages;
    this.chooseImage = ::this.chooseImage;
    this.nextImages = ::this.nextImages;
    this.renderSelected = ::this.renderSelected;
    this.renderImage = ::this.renderImage;
    this.routeToAvatarCamera = ::this.routeToAvatarCamera;
    this.fetchParams = {
      first: 25,
      after: undefined,
      assetType: props.tab,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchImages();
    });
  }

  storeImages(data) {
    const assets = data.edges;
    const images = assets.map((asset) => asset.node.image);
    const { images: existingImages, dataSource } = this.state;
    const nextImageCollection = existingImages.concat(images);
    this.setState({
      images: this.state.images.concat(images),
      dataSource: dataSource.cloneWithRows(nextImageCollection)
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
      .catch(error => AlertMessage.fromRequest(error));
  }

  chooseImage(chosenImage) {
    const { images, dataSource } = this.state;

    const mappedImages = images.map((image) => {
      if (image.uri !== chosenImage.uri) {
        return { ...image, selected: false };
      }
      return { ...image, selected: true };
    });

    this.setState({
      chosenImage,
      images: mappedImages,
      dataSource: dataSource.cloneWithRows(mappedImages)
    });
  }

  routeToAvatarCamera() {
    if (this.state.chosenImage.uri) {
      this.props.imageSelected(this.state.chosenImage, this.props.routeBack);
    }
  }

  renderSelected(image) {
    if (this.state.chosenImage.uri === image.uri) {
      return (
        <View style={styles.imageSelected} />
      );
    }
    return void(0);
  }

  renderImage(image, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.chooseImage(image, index)}
        style={styles.image}
      >
        <Image
          style={styles.image}
          resizeMode="cover"
          resizeMethod={'resize'}
          source={{ uri: image.uri }}
          progressiveRenderingEnabled={true}
        />
        {this.renderSelected(image)}
      </TouchableOpacity>
    );
  }

  render() {
    const { dataSource } = this.state;
    const { routeBack } = this.props;
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} />
        <View style={styles.navBar}>
          <LabelText style={[styles.navBarLabel]}>
            Select your profile image
          </LabelText>
        </View>
        <View style={styles.cameraRoll}>
          <ListView
            bounces={false}
            scrollEventThrottle={5}
            enableEmptySections={true}
            onScroll={this.nextImages}
            dataSource={dataSource}
            contentContainerStyle={styles.imageGrid}
            renderRow={this.renderImage}
            pageSize={3}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={[styles.button]} onPress={routeBack}>
              <LabelText style={styles.label}>Cancel</LabelText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={this.routeToAvatarCamera} >
              <LabelText style={styles.label}>Next</LabelText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
