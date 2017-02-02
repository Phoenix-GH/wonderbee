export default function () {
  return function insertImageTags(hook) {
    if (hook._data && hook._data.tags.length > 0) {
      const promises = hook._data.tags.map(tag => {
        const request = {
          imageId: hook.result.id,
          userId: tag.id,
          text: tag.username,
          x: tag.initialX,
          y: tag.initialY,
        };
        return hook.app.service('imageTags').create(request);
      });
      Promise.all(promises)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
