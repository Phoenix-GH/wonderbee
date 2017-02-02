export default function () {
  return function attachUserDetails(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((result, i) => {
        const userDetails = {
          isOwner: hook.params.user.id === result.createdBy.id,
          username: result.createdBy.username,
          id: result.createdBy.id,
        };
        const userId = result.createdBy.id;
        const query = { followUserId: userId, userId: hook.params.user.id };
        return this.count({ userId })
        .then(count => (userDetails.postCount = count))
        .then(() => hook.app.service('followers').count(query))
        .then(count => (userDetails.currentlyFollowing = count > 0))
        .then(() => hook.app.service('followers').count({ userId }))
        .then(count => (userDetails.followingCount = count))
        .then(() => hook.app.service('followers').count({ followUserId: userId }))
        .then(count => {
          userDetails.followerCount = count;
          hook.result.data[i].userDetails = userDetails;
        });
      });
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
