export default function () {
  return function findAllGroups(hook) {
    if (hook.params.provider && !hook.params.query.groupMemberHash && !hook.params.query.id) {
      return hook.app.service('groupUsers').find({
        ...hook.params,
        query: {
          userId: hook.params.user.id,
          deleted: false,
        },
      })
      .then(groupMaps => {
        hook.params.query = { id: { $in: groupMaps.data.map(group => group.groupId) } };
        if (hook.params.search) {
          hook.params.query = {
            ...hook.params.query,
            name: hook.params.searchQuery,
          };
        }
        hook.params._groupMaps = groupMaps;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
