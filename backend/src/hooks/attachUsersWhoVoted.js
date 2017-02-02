// TODO: Make sure the post-votes, image-votes, and heatmap-votes models accept pagination and change this hook

export default function () {
  return function attachUsersWhoVoted(hook) {
    if (hook.params.provider) {
      const query = {
        $select: ['id', 'avatarUrl', 'name', 'username'],
      };
      const promises = hook.result.map((vote, i) =>
        hook.app.service('users').get(vote.userId, { query })
        .then(user => {
          hook.result[i] = Object.assign({}, user, {
            notCurrentUser: hook.params.user.id !== user.id,
          });
          const followingQuery = {
            userId: hook.params.user.id,
            followUserId: user.id,
          };
          return hook.app.service('followers').count(followingQuery);
        })
        .then(isFollowingCount => {
          hook.result[i].currentlyFollowing = isFollowingCount > 0;
        })
        .catch(error => console.log(error))
      );
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
