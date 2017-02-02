export default function () {
  return function queryWithCurrentUser(hook) {
    if (
      hook.params.provider &&
      !hook.params.query.hashtags &&
      !hook.params.query.userId &&
      !hook.params.query.locations
    ) {
      const query = {
        userId: hook.params.user.id,
        approved: true,
      };
      return hook.app.service('followers').find({ query, paginate: false })
      .then(followers => {
        const $in = followers.length > 0 ? [...followers.map(f => f.followUserId)] : [];
        $in.push(hook.params.user.id);
        hook.params.query.userId = { $in };
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
