export default function () {
  return function findPosts(hook) {
    if (hook.data.lookInto.posts) {
      const wordQuery = hook.data.words && { $regex: hook.data.words.join('|'), $options: 'i' };
      const hashtagQuery = hook.data.hashtags && { $in: hook.data.hashtags };
      if (wordQuery || hashtagQuery) {
        return hook.app.service('posts').find({
          query: {
            $or: [
              { title: wordQuery },
              { description: wordQuery },
              { hashtags: hashtagQuery },
            ],
          },
        }).then(posts => {
          hook.result.posts = posts;
          return hook;
        });
      }
    }
    return hook;
  };
}
