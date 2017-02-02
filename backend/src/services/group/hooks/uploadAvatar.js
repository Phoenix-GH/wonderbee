export default function () {
  return function (hook) {
    if (hook.params.provider && hook.data.avatarUrl) {
      const query = {
        type: 'image',
        media: hook.data.avatarUrl
      };
      return hook.app.service('uploads').create(query, hook.params)
      .then(data => {
        hook.data.avatarUrl = data.url;
        return hook;
      })
      .catch((e) => {
        throw new Error(e);
      });  
    }
    return hook;
  };
}
