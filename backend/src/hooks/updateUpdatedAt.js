export default function () {
  return function updateUpdatedAt(hook) {
    if (hook.params.provider) {
      hook.data.updatedAt = new Date();
    }
    return hook;
  };
}
