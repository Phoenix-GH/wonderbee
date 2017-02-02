export default function () {
  return function grabId(hook) {
    if (hook.params.provider) {
      return this.find({ query: hook.params.query })
      .then(results => {
        hook.id = results[0].id;
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
