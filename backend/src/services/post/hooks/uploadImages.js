export default function () {
  return function uploadImages(hook) {
    if (!hook.params.provider) {
      return hook;
    }
    hook._data = Object.assign({}, hook.data, { images: [] });
    const promises = hook.data.images.map((image, i) => {
      const request = {
        type: 'image',
        media: image.snappedSurface,
      };
      return hook.app.service('uploads').create(request, hook.params)
        .then(response => (hook._data.images[i] = {
          ...response,
          location: image.location,
          tags: image.tags,
          textOverlays: image.textOverlays,
          order: image.order,
        }))
        .catch(error => console.log(error));
    });
    hook.data = Object.assign({}, {
      title: hook.data.title,
      description: hook.data.description,
      visibility: hook.data.visibility,
      voting: hook.data.voting,
      emojiIds: hook.data.emojiIds,
      layout: hook.data.layout,
      expiresAt: hook.data.expiresAt,
    });
    return Promise.all(promises)
      .then(() => hook);
  };
}
