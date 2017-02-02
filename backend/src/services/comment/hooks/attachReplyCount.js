const getReplyInformation = (hook, comment, commentService) => {
  const query = {
    parentId: comment.id,
  };
  return commentService.count(query)
  .then(commentCount => ({ ...comment, commentCount }));
};

export default function () {
  return function attachUserReplyCount(hook) {
    if (hook.params.provider) {
      if (hook.method === 'find') {
        const promises = hook.result.data.map((comment, i) =>
          getReplyInformation(hook, comment, this)
          .then(result => (hook.result.data[i] = result))
          .catch(error => console.log(error))
        );
        return Promise.all(promises)
        .then(() => hook);
      }
      hook.result.commentCount = 0;
    }
    return hook;
  };
}
