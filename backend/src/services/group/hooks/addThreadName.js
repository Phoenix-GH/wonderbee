export default function () {
  return function addThreadName(hook) {
    if (hook.params.provider && hook.result.data.length === 0 && hook.params._query) {
      hook.result.users = hook.params._query.groupMemberHash.map(user => user.id);
      const createOptions = {
        name: '',
        userArray: hook.result.users,
        hidden: hook.result.users.length === 1,
      };

      return this.create(createOptions, hook.params)
        .then(result => {
          result.isAdmin = true;
          hook.result.data = [result];
          return hook;
        });
    }

    const promises = hook.result.data.map((thread, index) => {
      if (thread.name === '') {
        const query = {
          groupId: thread.id,
          userId: { $ne: hook.params.user.id },
        };
        return hook.app.service('groupUsers').find({ ...hook.params, query, paginate: false })
          .then(users => {
            const threadName = users.data.map(user => user.userInfo.username).join(', ');
            hook.result.data[index].name = threadName.length > 20 ?
              threadName.substr(0, 30).concat('...') :
              threadName;
            return hook;
          })
          .catch(error => console.log(error));
      }
      return hook;
    });
    return Promise.all(promises)
      .then(() => hook);
  };
}
