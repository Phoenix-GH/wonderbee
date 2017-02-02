export default function () {
  return function convertToJSON(hook) {
    if (hook.type === 'after') {
      if (
        hook.result.data &&
        hook.result.data.length > 0 &&
        typeof hook.result.data[0].toJSON === 'function'
      ) {
        hook.result.data = hook.result.data.map(data => data.toJSON());
      } else if (
        Array.isArray(hook.result) &&
        hook.result.length > 0 &&
        typeof hook.result[0].toJSON === 'function'
      ) {
        hook.result = hook.result.map(data => data.toJSON());
      } else if (hook.result && typeof hook.result.toJSON === 'function') {
        hook.result = hook.result.toJSON();
      }
    }
    return hook;
  };
}
