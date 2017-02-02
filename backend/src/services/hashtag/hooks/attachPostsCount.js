import Sequelize from 'sequelize';
import _ from 'lodash';

export default function () {
  return function getPostsCount(hook) {
    const query = {};
    let postCounts;
    if (Array.isArray(hook.result)) {
      query.hashtagId = { $in: hook.result.map(hashtag => hashtag.id) };
    } else {
      query.hashtagId = { $in: [hook.result.id] };
    }

    return hook.app.service('postHashtag').Model.findAll({
      where: query,
      attributes: ['hashtagId', [Sequelize.fn('Count', Sequelize.col('hashtagId')), 'posts']],
      group: ['hashtagId'],
    })
    .then(hashtags => { postCounts = _.keyBy(hashtags, 'hashtagId'); })
    .then(() => {
      if (Array.isArray(hook.result)) {
        hook.result.forEach((hashtag, i) => {
          hook.result[i] = hook.result[i].toJSON();
          hook.result[i].postCount = postCounts[hashtag.id].toJSON().posts;
        });
      } else {
        hook.result = hook.result.toJSON();
        hook.result.postCount = postCounts[hook.result.id].toJSON().posts;
      }
    });
  };
}
