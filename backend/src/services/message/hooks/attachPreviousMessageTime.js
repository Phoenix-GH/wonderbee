export default function () {
  return function attachPreviousMessageTime(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((message, i) => {
        if (i === hook.result.data.length - 1) {
          // check pagination top message has same date as previous
          const query = {
            groupId: message.groupId,
            $limit: 1,
            $select: ['id', 'createdAt'],
            createdAt: { $lt: message.createdAt },
          };
          return hook.app.service('messages').find({ query, paginate: false })
            .then(previous => {
              if (previous.length > 0) {
                hook.result.data[i].previousTime = previous[0].createdAt;
              } else {
                // this message is first initial message in chat
                hook.result.data[i].previousTime = -1;
              }
            })
            .catch(error => console.log(error));
        }
        return new Promise((resolve) => {
          hook.result.data[i].previousTime = hook.result.data[i + 1].createdAt;
          resolve(hook);
        });
      });
      return Promise.all(promises)
        .then(() => hook);
    }
    return hook;
  };
}
