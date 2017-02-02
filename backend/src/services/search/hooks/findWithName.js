export default function (modelName) {
  return function findWithName(hook) {
    if (hook.data.lookInto[modelName]) {
      if (
        (hook.data[modelName] && hook.data[modelName].length > 0) ||
        (hook.data.words && hook.data.words.length > 0)
      ) {
        hook.data[modelName] = hook.data[modelName] || [];
        const name = {
          $iLike: { $any: hook.data[modelName].concat(hook.data.words) },
        };
        const query = { name };
        if (hook.data.lookInto[modelName].exclude && hook.data.lookInto[modelName].exclude.length) {
          query.id = { $notIn: hook.data.lookInto[modelName].exclude };
        }
        return hook.app.service(modelName).find({ query })
        .then(results => {
          hook.result[modelName] = results;
          return hook;
        });
      }
    }
    return hook;
  };
}
