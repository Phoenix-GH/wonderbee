import { Component, PropTypes } from 'react';
import { AsyncStorage } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { resizeImage } from 'AppUtilities';
const KEY = 'postingImages';
const VIDEOS_KEY = 'postingVideos';

const imageProps = {
  pan: null,
  scale: null,
  location: null,
  tags: [],
  textOverlays: [],
  imageFilters: {
    rotate: '0deg',
    hue: 0,
    blur: 0,
    sepia: 0,
    sharpen: 0,
    negative: 0,
    contrast: 1,
    saturation: 1,
    brightness: 1,
    temperature: 6500,
    detail: { contrast: 0, sharpen: 0, saturation: 0, value: 0 },
  }
};

export class SavedImages extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    allImages: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    allImages: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      images: [],
      videos: [],
      render: false,
    };
    this.clearState = ::this.clearState;
    this.addImage = ::this.addImage;
    this.addPreviewImage = ::this.addPreviewImage;
    this.removeImage = ::this.removeImage;
    this.removeAllImages = ::this.removeAllImages;
    this.getState = ::this.getState;
    this.saveState = ::this.saveState;
    this.updateState = ::this.updateState;
    this.updateImage = ::this.updateImage;
    this.resizeImage = ::this.resizeImage;
    this.resizeAllImages = ::this.resizeAllImages;

    this.setVideo = ::this.setVideo;
    this.removeVideo = ::this.removeVideo;
  }

  componentDidMount() {
    this.getState();
  }

  getState() {
    AsyncStorage.getItem(KEY, (error, images) => {
      if (error) {
        console.log(error);
      }
      AsyncStorage.getItem(VIDEOS_KEY, (error, videos) => {
        if (error) {
          console.log(error);
        }
        this.setState({
          images: images && JSON.parse(images) || [],
          videos: videos && JSON.parse(videos) || [],
          render: true,
        });
      });
    });
  }

  clearState() {
    return new Promise(resolve =>
      resolve(this.setState({ images: [], videos: [] }))
    );
  }

  saveState() {
    AsyncStorage.setItem(KEY, JSON.stringify(this.state.images));
  }

  updateState(images) {
    this.setState({ images, render: true }, this.saveState);
  }

  addImage(image) {
    const newImage = Object.assign({}, image, { order: this.state.images.length + 1 }, imageProps);
    if (this.state.images.length < 4) {
      return new Promise(resolve =>
        resolve(this.updateState(this.state.images.concat(newImage)))
      );
    }
    return new Promise(resolve => resolve(null));
  }

  addPreviewImage(image) {
    const previewImage = { snappedSurface: image, order: 0 };
    return new Promise(resolve =>
      resolve(this.updateState(
        [previewImage].concat(this.state.images.filter(img => img.order !== 0)))
      )
    );
  }

  updateImage(imageId, image) {
    return new Promise(resolve =>
      resolve(this.updateState(
        this.state.images.filter(img => img.order !== imageId).concat(image)
      ))
    );
  }

  removeImage(image) {
    return new Promise(resolve =>
      resolve(this.updateState(this.state.images.filter(img => img.uri !== image.uri)))
    );
  }

  removeAllImages() {
    return new Promise(resolve =>
      resolve(this.updateState([]))
    );
  }

  resizeImage(image, cropRequired) {
    return resizeImage(image, cropRequired, 1080, WINDOW_WIDTH * 4 / 3);
  }

  resizeAllImages(needsResizing = true) {
    const images = [];
    const promises = this.state.images
    .sort((img1, img2) => (img1.order < img2.order ? -1 : 1))
    .map(img => {
      if (needsResizing) {
        return this.resizeImage(img)
        .then(image => images.push(Object.assign(image, this.updateScaleAndPan(image))));
      }
      return images.push(Object.assign(img, this.updateScaleAndPan(img)));
    });
    return Promise.all(promises)
    .then(() => this.updateState(images));
  }

  updateScaleAndPan({ size }) {
    const imageContainerWidth = WINDOW_WIDTH;
    const imageContainerHeight = WINDOW_WIDTH * 4 / 3;
    const scale = imageContainerHeight / size.height > imageContainerWidth / size.width ?
      imageContainerWidth / size.width :
      imageContainerHeight / size.height;
    return {
      scale,
      pan: {
        x: (imageContainerWidth - size.width) / 2,
        y: (imageContainerHeight - size.height) / 2,
      }
    };
  }

  setVideo(video) {
    const newVideo = Object.assign({}, video);
    return new Promise(resolve =>
      resolve(this.setState({videos:[newVideo], render:true}, this.saveVideo))
    );
  }

  removeVideo(video) {
    return new Promise(resolve =>
      resolve(this.setState({videos:[], render:true}, this.saveVideo))
    );
  }

  saveVideo() {
    AsyncStorage.setItem(VIDEOS_KEY, JSON.stringify(this.state.videos));
  }

  render() {
    const { images: allImages, render, videos } = this.state;
    const images = this.props.allImages ? allImages : allImages.filter(img => img.order !== 0);
    if (!render) {
      return null;
    }
    return this.props.children({
      images,
      addImage: this.addImage,
      addPreviewImage: this.addPreviewImage,
      removeImage: this.removeImage,
      removeAllImages: this.removeAllImages,
      updateImage: this.updateImage,
      clearState: this.clearState,
      resizeImage: this.resizeImage,
      resizeAllImages: this.resizeAllImages,

      videos,
      setVideo: this.setVideo,
      removeVideo: this.removeVideo,
    });
  }
}
