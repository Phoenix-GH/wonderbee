export default function () {
  const STATIC_COLONIES = [/* TODO: fill with ids of static colonies */];
  return function findColonies(hook) {
    if (hook.params.provider && hook.params.user) {
      if (hook.params.search) return hook;
      if (hook.params.query.all) {
        hook.params.query = {
          $or: [
            {
              userId: {
                $or: [1, hook.params.user.id, 0],
              },
            }, {
              id: {
                $in: STATIC_COLONIES,
              },
            },
          ],
        };
        hook.params.paginate = {};
      }
      if (hook.params.query.fromProfile) {
        hook.params.query = {
          userId: hook.params.query.userId,
          $limit: hook.params.query.$limit,
          $skip: hook.params.query.$skip,
        };
        if (hook.params.query.userId !== hook.params.user.id) {
          hook.params.query.visibility = 'all';
        }
      }
      return hook;
    }

    return hook;
  };
}
