export default function () {
  return function attachCommentCounts(hook) {
    if (hook.params.provider && hook.result.length > 0) {
      const commentService = hook.app.service('comments');
      const promises = hook.result.map((image, i) =>
        commentService.count({ imageId: image.id })
        .then(comments => {
          hook.result[i].commentCount = comments;
          return hook;
        })
        .catch(error => console.log(error))
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
