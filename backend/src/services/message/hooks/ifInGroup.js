// @TODO Remove once https://github.com/feathersjs/feathers/issues/405 is Resolved

export default function () {
  return function ifInGroup(hook) {
    const query = {
      groupId: hook.result.groupId,
      deleted: false,
      $select: ['userId'],
    };
    return hook.app.service('groupUsers').find({ paginate: false, query })
    .then(result => {
      hook.result.userIds = result.data.map(group => group.userId);
      return hook;
    })
    .catch(error => console.log(error));
  };
}
