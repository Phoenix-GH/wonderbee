export default function () {
  return function addUnreadCount(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((group, i) => {
        const query = {
          groupId: group.id,
          updatedAt: { $gt: group.lastReadAt },
          userId: { $ne: hook.params.user.id },
        };
        return hook.app.service('messages').find({ query, paginate: false })
        .then(messages => (hook.result.data[i].unreadCount = messages.length))
        .catch(error => console.log(error));
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
