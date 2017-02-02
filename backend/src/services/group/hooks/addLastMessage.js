export default function () {
  return function addLastMessage(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((group, i) => {
        const query = {
          groupId: group.id,
          $limit: 1,
          $select: ['createdAt'],
          $sort: { createdAt: -1 },
        };
        return hook.app.service('messages').find({ query, paginate: false })
        .then(message =>
          (hook.result.data[i].lastMessageTime = message.length > 0 ?
            message[0].createdAt : hook.result.data[i].updatedAt)
        )
        .catch(error => console.log(error));
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
