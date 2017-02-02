function getOneAvatar(colony, hook) {
  const data = {};
  let { users = [], locations = [], hashtags: colonyHashtags = [] } = colony;
  users = users || [];
  locations = locations || [];
  colonyHashtags = colonyHashtags || [];
  if (users.length + locations.length + colonyHashtags.length === 0) {
    return Promise.resolve({
      url: undefined,
      count: 0,
    });
  }
  return (colony.users && colony.users.length ?
    hook.app.service('posts').find({
      query: {
        userId: { $in: colony.users },
        $select: ['id'],
      },
      paginate: false,
    }) : Promise.resolve([]))
    .then(posts => {
      data.posts = posts.map(post => post.id.toString());
      if (!colony.hashtags || !colony.hashtags.length) {
        return posts;
      }

      const query = {
        hashtagId: { $in: colony.hashtags },
      };
      if (data.posts.length) {
        query.postId = { $in: data.posts };
      }
      return hook.app.service('postHashtag').find({
        query,
        paginate: false,
      })
      .then(hashtags => {
        const postIds = hashtags.map(hashtag => hashtag.postId);
        if (!users.length) {
          data.posts = postIds;
        } else {
          data.posts = data.posts.filter(post => postIds.includes(post));
        }
      });
    })
    .then(() => {
      if (!locations.length) {
        return null;
      }

      const query = {
        locationId: { $in: colony.locations },
      };
      if (data.posts.length) {
        query.postId = { $in: data.posts };
      }
      return hook.app.service('images').find({
        query,
        paginate: false,
        noVotes: true,
      })
      .then(images => {
        const postIds = images.map(image => image.postId);
        if (users.length + colonyHashtags.length === 0) {
          data.posts = postIds;
        } else {
          data.posts = data.posts.filter(post => postIds.includes(post));
        }
      });
    })
    .then(() => (data.posts.length ?
                hook.app.service('postVotes').findMostVotedPost(data.posts) :
                null))
    .then((mostVoted) => hook.app.service('images').find({
      query: {
        order: 0,
        postId: mostVoted && mostVoted.postId || data.posts[0],
        $select: ['id', 'url'],
      },
      noVotes: true,
      paginate: false,
    })
    .then(image => ({
      url: image[0] && image[0].url,
      count: data.posts.length,
    }))
    );
}

export default function () {
  return function getAvatarImage(hook) {
    if (hook.params.provider) {
      if (Array.isArray(hook.result)) {
        hook.result = {
          data: hook.result,
          total: hook.result.length,
        };
      }
      return new Promise((resolve, reject) => {
        if (Array.isArray(hook.result.data)) {
          hook.result.data = hook.result.data.map(data => data.toJSON());
          Promise.all(hook.result.data.map(col => getOneAvatar(col, hook)))
           .then((data) => {
             hook.result.data.forEach((result, i) => {
               hook.result.data[i].avatarUrl = data[i].url;
               hook.result.data[i].postCount = data[i].count;
             });
             return resolve(hook);
           })
           .catch(reject);
        } else {
          hook.result = hook.result.toJSON();
          getOneAvatar(hook.result, hook)
          .then((data) => {
            hook.result.avatarUrl = data.url;
            hook.result.postCount = data.count;
            return resolve(hook);
          })
          .catch(reject);
        }
      });
    }
    return hook;
  };
}
