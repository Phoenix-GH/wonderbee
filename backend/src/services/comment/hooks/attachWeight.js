export default function () {
  return function attachWeight(hook) {
    const query = {
      followUserId: hook.data.userId,
    };
    return hook.app.service('followers').count(query)
    .then(count => {
      hook.data.weight = count;
      return hook;
    });
  };
}
