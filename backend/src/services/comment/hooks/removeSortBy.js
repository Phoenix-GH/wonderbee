export default function () {
  return function removeSortBy(hook) {
    if (hook.params.provider && hook.params.query.sortBy) {
      const { sortBy, ...query } = hook.params.query;
      switch (sortBy) {
        case 'Most Controversial': {
          const { $skip, ...queryWithoutSkip } = query;
          const findAllQuery = {
            where: queryWithoutSkip,
            include: [{
              model: hook.app.service('commentVotes').Model,
              required: false,
            }],
            subQuery: false,
            limit: 10,
            offset: $skip,
            order: [
              [hook.app.service('commentVotes').Model, 'value', 'DESC'],
            ],
          };
          return this.findAll(findAllQuery)
          .then(results => {
            hook.result = results;
            return hook;
          })
          .catch(error => console.log(error));
        }
        case 'Highest Rated': {
          const { $skip, ...queryWithoutSkip } = query;
          const findAllQuery = {
            where: queryWithoutSkip,
            include: [{
              model: hook.app.service('commentVotes').Model,
              required: false,
            }],
            subQuery: false,
            limit: 10,
            offset: $skip,
            order: 'COALESCE("commentVotes"."value", 0) DESC',
          };
          return this.findAll(findAllQuery)
          .then(results => {
            hook.result = results;
            return hook;
          })
          .catch(error => console.log(error));
        }
        case 'Popular User': {
          hook.params.query = Object.assign({}, query, { $sort: { weight: -1, createdAt: -1 } });
          break;
        }
        case 'Oldest': {
          hook.params.query = Object.assign({}, query, { $sort: { createdAt: 1 } });
          break;
        }
        case 'Newest':
        default: {
          hook.params.query = Object.assign({}, query, { $sort: { createdAt: -1 } });
          break;
        }
      }
    }
    return hook;
  };
}
