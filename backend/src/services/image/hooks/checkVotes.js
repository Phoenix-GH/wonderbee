export default function () {
  return function checkVotes(hook) {
    if (hook.params.noVotes) {
      return hook;
    }
    if (hook.params.provider && hook.result.length > 1) {
      const imageVoteService = hook.app.service('imageVotes');
      const promises = hook.result.map((image, i) => {
        const query = {
          imageId: image.id,
          userId: hook.params.user.id,
        };
        return imageVoteService.count(query)
        .then(imageVotes => {
          hook.result[i].voted = imageVotes > 0;
          return hook;
        })
        .catch(error => console.log(error));
      });
      return Promise.all(promises)
      .then(() => hook);
    }
    const heatmapVoteService = hook.app.service('heatmapVotes');
    const query = {
      imageId: hook.result[0].id,
      userId: hook.params.user.id,
    };
    return heatmapVoteService.count(query)
    .then(heatmapVotes => {
      hook.result[0].voted = heatmapVotes > 0;
      return hook;
    });
  };
}
