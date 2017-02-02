export default function () {
  return function attachComments(hook) {
    if (hook.params.provider && hook.result.data.length > 0) {
      const commentService = hook.app.service('comments');
      const promises = hook.result.data.map((post, i) => {
        const query = {
          postId: post.id,
          parentId: null,
          $sort: { createdAt: -1 },
        };
        const params = Object.assign({}, hook.params, { query });
        return commentService.find(params)
        .then(comments => {
          hook.result.data[i].comments = comments;
        })
        .then(() => commentService.count({ postId: post.id }))
        .then(commentCount => {
          hook.result.data[i].comments.total = commentCount;
          return hook;
        })
        .catch(error => console.log(error));
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
