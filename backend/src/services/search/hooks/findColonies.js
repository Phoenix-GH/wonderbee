export default function () {
  return function findColonies(hook) {
    if (hook.data.lookInto.colonies && (hook.data.words && hook.data.words.length > 0)) {
      const userQuery = {
        $like: { $any: hook.data.words },
      };
      const query = {
        name: userQuery,
        $or: [
          { visibility: 'all' },
          { userId: hook.params.user.id },
          { users: { $contains: [hook.params.user.id] } },
        ],
      };
      if (hook.data.lookInto.colonies.exclude) {
        query.id = { $notIn: hook.data.lookInto.colonies.exclude };
      }
      return hook.app.service('colonies').find({
        ...hook.params,
        query,
        search: true,
        paginate: {},
      })
      .then(colonies => {
        hook.result.colonies = colonies.data.map(colony => ({ ...colony, resultType: 'colonies' }));
        return hook;
      });
    }
    return hook;
  };
}
