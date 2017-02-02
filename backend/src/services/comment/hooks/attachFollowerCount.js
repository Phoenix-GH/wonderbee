const getFollowerInformation = (hook, comment) => {
  const query = {
    userId: comment.userId,
  };
  return hook.app.service('followers').count(query)
  .then(followerCount => ({ ...comment, followerCount }));
};

export default function () {
  return function attachFollowerCount(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((comment, i) =>
        getFollowerInformation(hook, comment)
        .then(result => (hook.result.data[i] = result))
        .catch(error => console.log(error))
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
