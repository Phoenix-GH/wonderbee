export default function () {
  return function findMutual(hook) {
    if (hook.params.provider && hook.params.user && hook.params.query.mutual) {
      return this.findMutual(hook.params.user.id, hook.params.query.user)
        .then(data => {
          hook.result = data;
          return hook;
        })
        .catch(err => {
          throw new Error(err);
        });
    }
    return hook;
  };
}
