export default function () {
  return function addNameString(hook) {
    if (hook.params.provider) {
      const promises = [];
      const query = { $select: ['username'] };
      hook.result.data.forEach((group, i) => {
        hook.result.data[i].involvedString = '';
        group.involved.forEach((user, j) =>
          promises.push(
            hook.app.service('users').get(user.userId, { query })
            .then(userId => {
              hook.result.data[i].involvedString += userId.username;
              hook.result.data[i].involved[j].avatarUrl = userId.avatarUrl;
            })
          )
        );
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
