// pass true for followers and false for following
export default function (follower) {
  return function addFollow(hook) {
    if (hook.params.provider) {
      const query = { [follower ? 'followUserId' : 'userId']: hook.result.id };
      return hook.app.service('followers').count(query)
      .then(total => {
        hook.result[follower ? 'followerCount' : 'followingCount'] = total;
        if (hook.params.user.id === hook.result.id && follower) {
          query.approved = false;
          return hook.app.service('followers').count(query)
            .then(count => {
              hook.result.needApproveCount = count;
              return hook;
            });
        }
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
