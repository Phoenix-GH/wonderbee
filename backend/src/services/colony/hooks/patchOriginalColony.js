export default function () {
  return function patchOriginalColony(hook) {
    if (hook.params.provider && hook.data.originalId) {
      return this.get(hook.data.originalId)
      .then(data => {
        const copiedBy = data.copiedBy.concat(hook.params.user.id);
        return this.patch(hook.data.originalId, { copiedBy });
      })
      .then(() => hook);
    }
    return hook;
  };
}
