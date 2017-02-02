export default function () {
  return function sendNotification(hook) {
    const { parentId, userId, postId, comment } = hook.result;
    const notificationService = hook.app.service('notifications');

    let message = '';

    if (!parentId) {
      hook.app.service('users').get(userId)
      .then(userDetails => {
        message += userDetails.name ? userDetails.name : userDetails.username;
      })
      .then(() => hook.app.service('posts').get(postId))
      .then(post => {
        if (post.userId !== userId) {
          message += ` commented on your post: ${comment}`;
          notificationService.create({
            data: {
              message,
              type: 'comment',
            },
            userId: post.userId,
          });
        }
      });
    } else {
      hook.app.service('users').get(userId)
      .then(userDetails => {
        message += userDetails.name ? userDetails.name : userDetails.username;
      })
      .then(() => hook.app.service('comments').get(parentId))
      .then(_comment => {
        if (_comment.userId === userId) {
          return hook;
        }
        message += ` replied to your comment: ${comment}`;
        notificationService.create({
          data: {
            message,
            type: 'reply',
          },
          userId: _comment.userId,
        });
        return hook;
      });

    }
    return hook;
  };
}
