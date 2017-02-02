export default function () {
  return function attachCreatedBy(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((message, i) => {
        if (parseInt(message.userId) !== 0) {
          return hook.app.service('users').get(message.userId)
            .then((result) => {
              hook.result.data[i].createdBy = result;
              return hook;
            });
        }
        hook.result.data[i].systemMessage = true;
        return hook;
      });
      return Promise.all(promises)
        .then(() => hook);
    }
    return hook;
  };
}
