export default function () {
  return function checkVotes(hook) {
    if (hook.params.noVotes) {
      return hook;
    }
    if (hook.params.provider && hook.result.length > 1) {
      const imageVoteService = hook.app.service('imageVotes');
      const promises = hook.result.map((image, i) =>
        imageVoteService.count({ imageId: image.id })
        .then(imageVotes => {
          hook.result[i].votes = imageVotes;
          return hook;
        })
        .catch(error => console.log(error))
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook.app.service('heatmapVotes').count({ imageId: hook.result[0].id })
    .then(heatmapVotes => {
      hook.result[0].votes = heatmapVotes;
      return hook;
    });
  };
}
