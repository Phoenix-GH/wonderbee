export default function () {
  return function findGroups(hook) {
    if (hook.data.lookInto.groups && (hook.data.words && hook.data.words.length > 0)) {
      const groupsQuery = {
        $like: { $any: hook.data.words },
      };

      return hook.app.service('groups').find({
        ...hook.params,
        searchQuery: groupsQuery,
        search: true,
        paginate: false,
      })
      .then(groups => {
        hook.result.groups = groups.data.map(group => ({ ...group, resultType: 'groups' }));
        return hook;
      });
    }
    return hook;
  };
}
