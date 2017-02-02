export default function () {
  return function getImageDims(hook) {
    return hook.app.service('images').get(hook.id)
    .then(image => {
      hook.data = { width: image.width, height: image.height };
      return hook;
    });
  };
}
