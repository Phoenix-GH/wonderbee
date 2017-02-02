export default function () {
  return function checkFollowing(hook) {
    if (hook.params.provider) {
      const query = {
        userId: hook.params.user.id,
        followUserId: hook.result.id,
      };
      hook.app.service('followers').count(query)
      .then(followingCount => {
        hook.result.currentlyFollowing = followingCount > 0;
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
