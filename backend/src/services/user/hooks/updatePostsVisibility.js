export default function () {
  return function updatePostsVisibility(hook) {
    const user = hook.params.user;
    if (hook.params.provider && hook.data.private !== undefined &&
                                hook.data.private !== user.private) {
      return hook.app.service('posts').Model.update({
        visibility: hook.data.private ? 'followers' : 'all',
      }, {
        where: {
          userId: user.id,
          visibility: hook.data.private ? 'all' : 'followers',
        },
      })
      .then(() => hook);
    }
    return hook;
  };
}
