export default function () {
  return function filterDeleted(hook) {
    if (hook.params.provider) {
      hook.params.query.deleted = false;
    }
    return hook;
  };
}
