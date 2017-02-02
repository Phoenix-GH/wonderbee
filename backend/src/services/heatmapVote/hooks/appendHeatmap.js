import Heatmap from '../Heatmap';

export default function (pointRadius) {
  return function appendHeatmap(hook) {
    if (hook.params.provider && hook.result && hook.result.votes && hook.result.votes.length) {
      const heatmap = new Heatmap(hook.data.width, pointRadius, hook.data.width / hook.data.height);
      heatmap.init();
      hook.result.votes.forEach(({ position, votes }) => {
        let weight = votes / hook.result.totalVotes + 0.35;
        if (weight > 1) {
          weight = 1;
        }
        heatmap.addPoint(position.x, position.y, weight);
      });
      heatmap.draw();
      hook.result.heatmap = heatmap.toDataURL();
    } else {
      hook.app.service('images').get(hook.id)
      .then(image => {
        hook.result.heatmap = image.heatMapUrl;
        return hook;
      });
    }
  };
}
