export default function () {
  return function addPostCount(hook) {
    if (hook.params.provider) {
      return hook.app.service('posts').count({ userId: hook.result.id })
      .then(postCount => {
        hook.result.postCount = postCount;
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
