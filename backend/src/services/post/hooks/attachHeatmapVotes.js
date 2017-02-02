export default function () {
  return function attachHeatmapVotes(hook) {
    if (hook.params.provider) {
      const promises = [];
      hook.result.data.forEach((post, i) => {
        if (post.heatmap) {
          promises.push(
            hook.app.service('heatmapVotes').get(post.images[0].id, { user: hook.params.user })
            .then(heatmap => {
              hook.result.data[i].heatmapVotes = heatmap;
            })
            .catch(error => console.log(error))
          );
        }
      });
      return promises.length === 0 ? hook : Promise.all(promises).then(() => hook);
    }
    return hook;
  };
}
