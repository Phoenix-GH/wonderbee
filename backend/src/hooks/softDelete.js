export default function () {
  return function softDelete(hook) {
    switch (hook.method) {
      case 'remove':
        return this.patch(hook.id, { deleted: true })
        .then(data => {
          hook.result = data;
          return hook;
        });
      case 'find':
      case 'get':
      case 'update': {
        hook.params.query.deleted = { $ne: true };
        return hook;
      }
      default:
        return hook;
    }
  };
}
