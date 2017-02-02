export default function () {
  return function patchOriginalAndSoftDelete(hook) {
    if (hook.params.provider) {
      return this.get(hook.id)
        .then(data => {
          if (data.originalId) {
            this.update(data.originalId, { $pull: { copiedBy: hook.params.id } });
          }
          return this.patch(hook.id, { deleted: true });
        })
        .then(deletedData => {
          hook.result = deletedData;
          return hook;
        });
    }
    return hook;
  };
}
