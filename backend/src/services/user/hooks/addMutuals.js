export default function () {
  return function addMutuals(hook) {
    if (hook.params.user && hook.id !== hook.params.user.id) {
      return hook.app.service('followers').findMutual(hook.id, hook.params.user.id)
      .then(ids =>
        this.find({
          query: {
            id: {
              $in: ids.map((id) => id.userId),
            },
          },
        })
      )
      .then(mutuals => {
        hook.result.mutuals = mutuals;
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
