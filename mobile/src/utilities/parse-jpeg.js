import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

if (! global.Buffer) {
  global.Buffer = Buffer;
}

export function parseJpeg(image) {
  if (typeof image === 'string' && image.startsWith('data:image/jpeg;base64,')) {
    const data = atob(image.substring(23));
    const uint8Array = new Uint8Array(data.length);

    for (let index = 0; index < data.length; index++) {
      uint8Array[index] = data.charCodeAt(index);
    }
  }
  else {
    const data = image;
  }

  const decodedImage = jpeg.decode(data);

  return {
    width: decodedImage.width,
    height: decodedImage.height
  };
}
