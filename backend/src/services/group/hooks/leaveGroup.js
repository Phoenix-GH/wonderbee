/**
 * Created by BaeBae on 9/14/16.
 */

export default function () {
  function createLeaveMessage(hook) {
    const message = hook.app.service('messages');
    const content = `${hook.params.user.name} left the discussion.`;
    return message.create({
      groupId: hook.id,
      userId: 0,
      content,
    });
  }

  function promptUser(hook, user) {
    if (user) {
      const message = hook.app.service('messages');
      const content =
        `${hook.params.user.name} left the discussion, ${user.userInfo.name} is now the admin`;
      return message.create({
        groupId: hook.id,
        userId: 0,
        content,
      })
        .then(() => {
          const groupMap = hook.app.service('groupUsers');
          const query = {
            groupId: hook.id,
            userId: user.userId,
          };
          return groupMap.patch(null, { isAdmin: true }, { query });
        });
    }
    return createLeaveMessage(hook)
      .then(() => hook);
  }

  function deleteUserFromGroup(hook) {
    const groupMap = hook.app.service('groupUsers');
    const query = {
      groupId: hook.id,
      userId: hook.params.user.id,
    };
    return groupMap.patch(null, { deleted: true }, { query });
  }

  function promoteAdmin(hook, user) {
    const groupMap = hook.app.service('groupUsers');
    const query = {
      groupId: hook.id,
      deleted: false,
      $limit: 1,
      $sort: { createdAt: -1 },
    };
    if (user && user.isAdmin) {
      return hook.app.service('groups').get(hook.id)
        .then((currentGroup) => {
          if (!currentGroup.hidden) {
            return groupMap.find({ ...hook.params, query, paginate: false })
              .then((result) => promptUser(hook, result.data[0]));
          }
          return hook;
        });
    }
    return createLeaveMessage(hook)
      .then(() => hook);
  }

  function removeAllHistory(hook) {
    const groupMap = hook.app.service('groupUsers');
    const query = {
      groupId: hook.id,
      deleted: false,
    };
    return groupMap.find({ ...hook.params, query, paginate: false })
      .then((result) => {
        if (result.data.length === 0) {
          const removeQuery = {
            groupId: hook.id,
          };
          const promises = [];
          promises.push(hook.app.service('messages').remove(null, { query: removeQuery }));
          promises.push(hook.app.service('groupUsers').remove(null, { query: removeQuery }));
          promises.push(hook.app.service('groups').remove(hook.id));
          return Promise.all(promises)
            .then(() => hook);
        }
        return hook;
      });
  }

  return function leaveGroup(hook) {
    if (hook.params.provider && hook.data.requestType === 'leaveGroup') {
      return deleteUserFromGroup(hook)
        .then((result) => promoteAdmin(hook, result[0]))
        .then(() => removeAllHistory(hook))
        .then(() => hook);
    }
    return hook;
  };
}
