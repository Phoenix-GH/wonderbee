const checkVoteStatus = (hook, commentId, userId) => {
  const query = {
    commentId,
    userId,
  };
  return hook.app.service('commentVotes').sum('value', query)
  .then(sum => ({ upvoted: sum > 0, downvoted: sum < 0 }));
};

export default function () {
  return function attachVoteStatus(hook) {
    if (hook.params.provider) {
      if (hook.method === 'find') {
        const promises = hook.result.data.map((comment, i) =>
          checkVoteStatus(hook, comment.id, hook.params.user.id)
          .then(result => (
            hook.result.data[i] = {
              ...hook.result.data[i],
              ...result,
              isOwner: hook.params.user.id === hook.result.data[i].createdBy.id,
            }
          ))
          .catch(error => console.log(error))
        );
        return Promise.all(promises)
        .then(() => hook);
      }
      hook.result = {
        ...hook.result,
        upvoted: false,
        downvoted: false,
        isOwner: hook.params.user.id === hook.result.createdBy.id,
      };
    }
    return hook;
  };
}
