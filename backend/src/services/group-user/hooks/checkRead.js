export default function () {
  return function checkRead(hook) {
    if (hook.params.provider) {
      const messageService = hook.app.service('messages');
      const promises = hook.result.data.map((group, i) => {
        const query = {
          groupId: group.groupId,
          $limit: 1,
          $select: ['createdAt', 'content'],
          $sort: { createdAt: -1 },
        };
        return messageService.find({ query, paginate: false })
        .then(messages => {
          hook.result.data[i].read = messages.length > 0 ?
            messages[0].createdAt < hook.result.data[i].updatedAt :
            true;
          hook.result.data[i].lastMessage =
            messages[0] && messages[0].content || 'No Message has been created';
        })
        .catch(error => console.log(error));
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
