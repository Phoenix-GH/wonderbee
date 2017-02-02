export default function () {
  return function createMapping(hook) {
    hook._data.userArray.concat(hook.params.user.id).forEach(userId =>
      hook.app.service('groupUsers').create({
        userId,
        groupId: hook.result.id,
        isAdmin: hook.params.user.id === userId,
        isActive: hook.params.user.id === userId,
      })
    );
    return hook;
  };
}
