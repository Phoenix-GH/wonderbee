export default function () {
  return function removeNested(hook) {
    if (hook.params.provider) {
      // pass in hook.params so that this function runs recursively
      if (hook.id) {
        this.remove(null, { ...hook.params, query: { parentId: hook.id } });
      }
    }
    return hook;
  };
}
