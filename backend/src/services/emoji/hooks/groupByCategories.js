import _ from 'lodash';

export default function () {
  return function groupByCategories(hook) {
    if (hook._query && hook._query.all) {
      hook.result = Object.assign({}, _.groupBy(hook.result, 'category'));
    }
    return hook;
  };
}
