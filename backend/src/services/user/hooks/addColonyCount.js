export default function () {
  return function addColonyCount(hook) {
    if (hook.params.provider) {
      return hook.app.service('colonies').count({ userId: hook.result.id })
      .then(colonyCount => {
        hook.result.colonyCount = colonyCount;
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
