export default function () {
  return function addUserCount(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((group, i) =>
        hook.app.service('groupUsers').count({ groupId: group.id })
        .then(userCount => {
          hook.result.data[i].userCount = userCount;
          return hook;
        })
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
