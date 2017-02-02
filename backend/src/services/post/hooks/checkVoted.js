import moment from 'moment';

export default function () {
  return function checkVoted(hook) {
    if (hook.params.provider && hook.result.data.length > 0) {
      const promises = hook.result.data.map((post, i) => {
        const query = {
          userId: hook.params.user.id,
          postId: post.id,
        };
        return hook.app.service('postVotes').find({ query })
        .then(votes => {
          hook.result.data[i].voted = votes.length > 0;
          hook.result.data[i].votes = Object.assign({},
            hook.result.data[i].votes, {
              userVotes: votes[0] || {},
            },
          );
        });
      });
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
