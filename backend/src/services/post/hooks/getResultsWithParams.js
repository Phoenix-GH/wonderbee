export default function () {
  return function getResultsWithParams(hook) {
    if (
      hook.params.provider &&
      (hook.params.query.hashtags ||
      hook.params.query.userId ||
      hook.params.query.locations)
    ) {
      if (hook.params.query.hashtags) {
        const hashtags = [];
        const promises = hook.params.query.hashtags.$in.map(hashtag => {
          if (hashtag.indexOf('#') === 0) {
            return hook.app.service('hashtags').find({ query: { name: hashtag.substring(1) } })
            .then(result => {
              hashtags.push(result[0].id);
            })
            .catch(error => console.log(error));
          }
          return new Promise(resolve => resolve(hashtags.push(hashtag)));
        });
        return Promise.all(promises)
        .then(() => {
          const query = { hashtagId: { $in: hashtags } };
          return hook.app.service('postHashtag').find({ query })
          .then(results => {
            const postIds = results.map(hashtag => hashtag.postId);
            hook.params.query = Object.assign(
              {},
              { id: { $in: postIds }, $skip: hook.params.query.$skip }
            );
            return hook;
          })
          .catch(error => console.log(error));
        });
      }
    }
    return hook;
  };
}
