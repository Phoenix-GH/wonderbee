const getVoteInformation = (hook, commentId, value) => {
  const query = {
    commentId,
    value,
  };
  return hook.app.service('commentVotes').count(query)
  .then(votes => ({ [value > 0 ? 'upvotes' : 'downvotes']: votes }));
};

export default function (value) {
  return function attachVoteCount(hook) {
    if (hook.params.provider) {
      if (hook.method === 'find') {
        const promises = hook.result.data.map((comment, i) =>
          getVoteInformation(hook, comment.id, value)
          .then(result => (hook.result.data[i] = { ...hook.result.data[i], ...result }))
          .catch(error => console.log(error))
        );
        return Promise.all(promises)
        .then(() => hook);
      }
      hook.result = {
        ...hook.result,
        upvotes: 0,
        downvotes: 0,
      };
    }
    return hook;
  };
}
