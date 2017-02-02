export default function () {
  return function insertImages(hook) {
    if (hook.params.provider) {
      const promises = hook._data.images.map(image => {
        const request = {
          order: image.order,
          url: image.url,
          postId: hook.result.id,
          width: image.width,
          height: image.height,
          textOverlays: image.textOverlays,
          tags: image.tags,
        };
        if (!image.location) {
          return hook.app.service('images').create(request)
          .catch(error => console.log(error));
        }

        const location = image.location;
        location.type = location.type || 'place';

        return hook.app.service('locations').create(location)
        .then(data => {
          request.locationId = data.id;
          return hook.app.service('images').create(request);
        })
        .catch(error => console.log(error));
      });

      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
