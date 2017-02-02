import _ from 'lodash';

export default function () {
  return function groupByRows(hook) {
    if (hook._query && hook._query.all) {
      const categories = [];
      Object.keys(hook.result).forEach(key => {
        hook.result[key] = _.chunk(hook.result[key], 8);
        categories.push(key);
      });
      hook.result = Object.assign({}, hook.result, { categories });
    }
    return hook;
  };
}
