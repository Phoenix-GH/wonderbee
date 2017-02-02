export default function () {
  return function attachImageTags(hook) {
    if (hook.params.provider) {
      const promises = hook.result.map((image, i) => {
        const query = {
          imageId: image.id,
        };
        return hook.app.service('imageTags').find({ query })
        .then(imageTags => {
          hook.result[i].imageTags = imageTags;
        });
      });
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
