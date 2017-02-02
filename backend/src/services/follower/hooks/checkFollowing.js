// Sees if the current user is following the users returned
export default function () {
  return function checkFollowing(hook) {
    const { requestType } = hook.params._query;
    if (hook.params.provider &&
      (requestType === 'checkFollowings' || requestType === 'checkFollowers')) {
      const promises = [];
      const currentUserId = hook.params.user.id;
      hook.result.data.forEach((result, i) => {
        const query = {
          followUserId: requestType === 'checkFollowings' ? result.followUserId : result.userId,
          userId: currentUserId,
        };
        promises.push(this.find({ query })
        .then(data => (hook.result.data[i].currentlyFollowing = data.total > 0)));
      });
      return Promise.all(promises)
        .then(() => hook);
    }
    return hook;
  };
}
