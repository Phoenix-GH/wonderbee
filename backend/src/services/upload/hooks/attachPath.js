import { parseDataURI } from 'dauria';
import mimeTypes from 'mime-types';
import crypto from 'crypto';
import sizeOf from 'image-size';

export default function () {
  return function attachPath(hook) {
    // check if group content
    let path = hook.data.groupId ? `g/${hook.data.groupId}` : `u/${hook.params.user.id}`;

    // read media to get content type
    const { buffer, MIME: contentType } = parseDataURI(hook.data.media);

    // since we're reading the media, lets get the hash from it
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // double check for jpg types and change to jpeg
    const mimeType = (contentType === 'image/jpg') ? 'image/jpeg' : contentType;

    // now that we have the contentType from the media, lets figure out the extension
    const ext = mimeTypes.extension(mimeType);

    // set dimensions of the image in the hook data
    const getImageDimension = () => {
      const dimensions = sizeOf(buffer);
      // set avatar size on return data
      hook.data = {
        ...hook.data,
        width: dimensions.width,
        height: dimensions.height,
      };
    };

    // TODO: need to get video dimensions
    const getVideoDimension = () => {
      // set video size
      hook.data.width = '100';
      hook.data.height = '100';
    };

    // check media type and takea appropriate action
    switch (hook.data.type) {
      case 'avatar':
        // set path
        path = `${path}/a`;
        // get size of image
        getImageDimension();
        break;
      case 'image':
        // set path
        path = `${path}/i`;
        // get size of image
        getImageDimension();
        break;
      case 'video':
        path = `${path}/v`;
        // get video dimensions
        getVideoDimension();
        break;
      default:
        // leave default location in base path with no subfolder
    }

    // set the location of the object and the uri
    hook.data.id = `${path}/${hash}.${ext}`;
    hook.data.uri = hook.data.media;


    return hook;
  };
}
