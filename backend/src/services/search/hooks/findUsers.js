export default function () {
  return function findUsers(hook) {
    if (
      hook.data.lookInto.users &&
      (
        hook.data.users.length > 0 ||
        (hook.data.words && hook.data.words.length > 0)
      )
    ) {
      const userQuery = {
        $iLike: { $any: hook.data.words },
      };
      const query = {
        $or: [
          { name: userQuery },
          { username: userQuery },
        ],
      };
      if (hook.data.lookInto.users.exclude) {
        query.id = { $notIn: hook.data.lookInto.users.exclude };
      }
      return hook.app.service('users').findAll(query)
      .then(users => {
        hook.result.users = users.map(user => ({ ...user, resultType: 'users' }));
        const promises = hook.result.users.map((user, i) =>
          hook.app.service('followers').count({
            userId: hook.params.user.id,
            followUserId: user.id,
          })
          .then(count => {
            hook.result.users[i].currentlyFollowing = count > 0;
          })
        );
        return Promise.all(promises);
      })
      .then(() => hook);
    }
    return hook;
  };
}
