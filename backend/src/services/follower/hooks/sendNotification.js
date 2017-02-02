/*
* @passed hook._usersToFollow from before hooks
* */

export default function () {
  return function (hook) {
    // there is no profile to send notification
    if (!hook._usersToFollow) {
      return hook;
    }
    const notificationService = hook.app.service('notifications');
    const currUser = hook.params.user.name || hook.params.user.username;
    const privateProfileMessage = `${currUser} has requested to follow you`;
    const publicProfileMessage = `${currUser} is now following you`;

    const users = hook._usersToFollow;
    const promises = users.map(({ id, isPrivate }) => (
      notificationService.create({
        type: 'push',
        userId: id,
        data: {
          type: 'followRequest',
          message: isPrivate ? privateProfileMessage : publicProfileMessage
        },
      })
    ));

    return Promise.all(promises)
      .then(() => hook)
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err) || hook);
  };
}
