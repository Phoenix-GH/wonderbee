import reduce from 'lodash/reduce';

export default function () {
  return function attachVoteCount(hook) {
    if (hook.params.provider && hook.result.data.length > 0) {
      const postVoteService = hook.app.service('postVotes');
      const promises = hook.result.data.map((post, i) => {
        if (!post.voting) {
          return postVoteService.groupByAndCount('emojiId', 'voteCount', { postId: post.id })
          .then(votes => {
            const totalVotes = reduce(votes,
              (sum, curr) => sum + parseInt(curr.voteCount, 10), 0
            );
            const highest = {
              votes: 0,
              key: null,
            };
            const votesByEmoji = votes.map((vote, j) => {
              if (parseInt(vote.voteCount, 10) > highest.votes) {
                highest.votes = vote.voteCount;
                highest.key = j;
              }
              return {
                ...vote,
                votePercent: parseInt(vote.voteCount, 10) / totalVotes,
                highest: false,
              };
            });
            if (votesByEmoji.length > 0 && highest.key) {
              votesByEmoji[highest.key].highest = true;
            }
            if (votesByEmoji.length < hook.result.data[i].emojis.length) {
              hook.result.data[i].emojis.forEach(emj => {
                if (votesByEmoji.filter(v => v.emojiId === emj.id.toString()).length === 0) {
                  votesByEmoji.push({
                    emojiId: emj.id.toString(),
                    highest: false,
                    voteCount: 0,
                    votePercent: 0,
                  });
                }
              });
            }
            hook.result.data[i].totalVotes = totalVotes;
            hook.result.data[i].votes = Object.assign({}, { votesByEmoji });
          });
        }
        return null;
      });
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
