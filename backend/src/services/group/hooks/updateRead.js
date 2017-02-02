export default function () {
  return function updateRead(hook) {
    if (hook.params.provider && hook.data.requestType === 'updateRead') {
      if (result.data.length > 0) {
        const query = {
          userId: hook.params.user.id,
          groupId: hook.id,
          $select: ['id'],
          $limit: 1,
        };
        const groupUserService = hook.app.service('groupUsers');
        return groupUserService.find({ query, paginate: false })
          .then(result => groupUserService.patch(result.data[0].id, { updatedAt: new Date() }))
          .then(patchedResult => {
            hook.result = patchedResult;
            return hook;
          })
          .catch(error => console.log(error));
      }
      return hook;
    }
    return hook;
  };
}
