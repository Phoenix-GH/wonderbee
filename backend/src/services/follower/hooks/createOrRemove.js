export default function () {
  return function createOrRemove(hook) {
    // In case bulkCreate
    if (Array.isArray(hook.data.people)) {
      return hook;
    }

    let isPrivate;
    let shouldSendNotification = true;

    return hook.app.service('users').Model.findById(hook.data.followUserId, {
      attributes: ['private'],
    })
    .then(user => (isPrivate = user.private))
    .then(() => this.find({ query: hook.data }))
    .then(results => (results.total > 0 && (
      this.remove(results.data[0].id)
        .then(result => (hook.result = result))
        .then(() => (shouldSendNotification = false))
    )))
    .then(() => {
      hook.data.approved = !isPrivate;
      if (shouldSendNotification) {
        hook._usersToFollow = [{ id: hook.data.followUserId, isPrivate }];
      }
      return hook;
    })
    .catch(error => console.log(error));
  };
}
