function postPluralOrNot(count) {
  return count > 1 ? 'posts' : 'post';
}
export default function () {
  return function combineResults(hook) {
    const {
      users = [],
      groups = [],
      locations = [],
      colonies = [],
      categories = [],
      hashtags = [],
    } = hook.result;
    hook.result = {
      ...hook.result,
      data: [
        ...colonies.map(colony => ({
          type: 'Colony',
          imageUrl: colony.avatarUrl,
          label: colony.name,
          id: colony.id,
          smallText: `${colony.postCount} ${postPluralOrNot(colony.postCount)}`,
          data: {
            users: colony.users,
            hashtags: colony.hashtags,
            locations: colony.locations,
          },
        })
        ),
        ...users.map(user => ({
          type: 'User',
          imageUrl: user.avatarUrl,
          label: user.username,
          id: user.id,
          smallText: user.name,
          data: user,
        })
        ),
        ...locations.map(location => ({
          type: 'Place',
          label: location.name,
          id: location.id,
        })
        ),
        ...hashtags.map(hashtag => ({
          type: 'Hashtag',
          label: hashtag.name,
          id: hashtag.id,
          smallText: `${hashtag.postCount} ${postPluralOrNot(hashtag.postCount)}`,
        })
        ),
      ],
      result: users
      .concat(groups)
      .concat(locations)
      .concat(colonies)
      .concat(categories)
      .concat(hashtags),
    };
    return hook;
  };
}
