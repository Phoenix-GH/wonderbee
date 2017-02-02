export default function () {
  return function upsertHashTag(hook) {
    return this.patch(null, hook.data, { query: hook.data })
    .then(result => {
      if (result.length > 0) {
        hook.result = result[0];
      }
      return hook;
    })
    .catch(() => hook);
  };
}
