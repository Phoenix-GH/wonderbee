export default function () {
  return function findAndInsertHashtags(hook) {
    if (hook.params.provider && hook.data.description) {
      const hashtags = hook.data.description.match(/#(\w+)/g);
      if (hashtags.length > 0) {
        const promises = hashtags.map(hashtag =>
          hook.app.service('hashtags').create({ name: hashtag.substring(1).toLowerCase() })
          .then(newHashtag => {
            hook.app.service('postHashtag').create({
              postId: hook.result.id,
              hashtagId: newHashtag.id,
            });
          })
        );
        return Promise.all(promises)
        .then(() => hook)
        .catch(error => console.log(error));
      }
    }
    return hook;
  };
}
