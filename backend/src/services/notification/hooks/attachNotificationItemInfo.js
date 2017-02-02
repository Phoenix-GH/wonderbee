const attachPostInformation = (hook) => {
  const promises = [];
  hook.result.map((notification, i) => {
    const { target } = notification;
    if (target === 'comment' || target === 'reply') {
      promises.push(
        hook.app.service('posts').get(notification[target].postId)
          .then(post => {
            hook.result[i].post = { images: post.images };
          })
      );
    }
    return null;
  });
  return promises;
};

export default function () {
  return function attachNotificationItemInfo(hook) {
    const promises = [];
    hook.result.map((notification, i) => {
      const { target } = notification;
      if (target === 'post') {
        promises.push(
          hook.app.service('posts').get(notification.targetId)
          .then(post => {
            hook.result[i].post = { images: post.images };
          })
        );
      } else if (target === 'comment') {
        promises.push(
          hook.app.service('comments').get(notification.targetId)
            .then(comment => {
              hook.result[i].comment = {
                targetId: comment.targetId,
                postId: comment.postId,
              };
            })
        );
      } else if (target === 'reply') {
        promises.push(
          hook.app.service('comments').get(notification.targetId)
          .then(reply => {
            hook.result[i].reply = {
              targetId: reply.targetId,
              postId: reply.postId,
            };
          })
        );
      }
    });
    return Promise.all(promises)
      .then(() =>
        Promise.all(attachPostInformation(hook)).then(() => hook)
      );
  };
}
