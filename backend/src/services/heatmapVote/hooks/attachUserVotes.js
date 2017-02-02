export default function () {
  return function attachUserVotes(hook) {
    if (hook.params.user.id) {
      const query = {
        userId: hook.params.user.id,
        imageId: hook.id,
      };
      return hook.app.service('heatmapVotes').find({ query })
      .then(results => {
        const userHeatmapVote = results.length > 0 && results[0].position;
        hook.result = Object.assign({}, hook.result, { userHeatmapVote });
        return hook;
      });
    }
    return hook;
  };
}
