export default function () {
  return function addCreatedAt(hook) {
    if (hook.params.provider) {
      const userId = hook.params.user.id;
      const groupId = hook.params.query.groupId;
      const groupUsers = hook.app.service('groupUsers');
      const query = { userId, groupId };
      return groupUsers.find({ query })
        .then((result) => {
          if (result.data.length > 0) {
            hook.params.query.createdAt = { $gt: result.data[0].createdAt };
          }
          return hook;
        });
    }
    return hook;
  };
}
