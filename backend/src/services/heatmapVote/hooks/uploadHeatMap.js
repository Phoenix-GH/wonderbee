export default function () {
  return function uploadHeatMap(hook) {
    if (hook.params.provider) {
      hook.app.service('uploads').create({ type: 'image', media: hook.result.heatmap }, hook.params)
      .then(response =>
        hook.app.service('images').patch(hook.id, { heatMapUrl: response.url })
      )
      .catch(error => console.log(error));
    }
    return hook;
  };
}
