import { Image, ImageEditor } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { WINDOW_HEIGHT } from 'AppConstants';

const cropImage = (image, size) => (
  new Promise(resolve => {
    ImageEditor.cropImage(image, {
      offset: { x: 0, y: 0 },
      size,
    }, uri => resolve(uri), () => null);
  })
);

export const resizeImage = (image, cropRequired, maxDim, cropSizeHeight) => {
  const path = image.path || image.uri;
  const resizeImageWithHeight = (newPath, width, height) => new Promise(resolve => {
    const size = {};
    if (width > height) {
      size.width = width > maxDim ? maxDim : width;
      size.height = size.width / width * height;
    } else {
      size.height = height > maxDim ? maxDim : height;
      size.width = size.height / height * width;
    }
    // eslint-disable-next-line max-len
    return ImageResizer.createResizedImage(newPath, size.width, size.height, 'JPEG', 100)
    .then(uri => resolve({ ...image, originalPicture: path, uri, size }));
  });
  return new Promise(resolve => {
    Image.getSize(path, (width, height) => {
      if (cropRequired) {
        const cropSize = {};
        if (width > height) {
          cropSize.width = cropSizeHeight / WINDOW_HEIGHT * width;
          cropSize.height = height;
        } else {
          cropSize.width = width;
          cropSize.height = cropSizeHeight / WINDOW_HEIGHT * height;
        }
        return cropImage(path, cropSize)
        .then(newPath => resizeImageWithHeight(newPath, cropSize.width, cropSize.height))
        .then(result => resolve(result));
      }
      return resizeImageWithHeight(path, width, height)
      .then(result => resolve(result));
    });
  });
};
