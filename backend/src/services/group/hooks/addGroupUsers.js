/**
 * Created by BaeBae on 9/14/16.
 */
export default function () {
  function createMessages(hook, users) {
    const promises = users.map(user => {
      const message = hook.app.service('messages');
      const content = `${user.username} was added to the group by ${hook.params.user.name}`;
      return message.create({
        groupId: hook.id,
        userId: 0,
        content,
      });
    });
    return Promise.all(promises)
      .then(() => hook);
  }
  return function addGroupUsers(hook) {
    const { requestType, users } = hook.data;
    if (hook.params.provider && requestType === 'addGroupUsers') {
      const groupMap = hook.app.service('groupUsers');
      const userIds = users.map((user) => user.id);
      const query = {
        userId: { $in: userIds },
      };
      return groupMap.remove(null, { query })
        .then(() => {
          const promises = userIds.map((id) => {
            return groupMap.create({
              userId: id,
              isAdmin: false,
              deleted: false,
              groupId: hook.id,
            });
          });
          return Promise.all(promises)
            .then(() => createMessages(hook, users));
        });
    }
    return hook;
  };
}
