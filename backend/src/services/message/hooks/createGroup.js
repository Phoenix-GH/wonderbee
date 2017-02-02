export default function () {
  return function createGroup(hook) {
    if (hook.params.provider && hook.data.groupId === undefined) {
      return hook.app.service('groups').create({
        name: hook.data.name,
        userArray: hook.data.users,
        hidden: hook.data.users.length === 1,
      }, hook.params)
      .then(result => {
        const users = [];
        hook.data.users.map((userId) => users.push({ userId }));
        hook._data = {
          users,
        };
        hook.data = Object.assign({}, {
          groupId: result.id,
          content: hook.data.content,
        });
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
