import _ from 'lodash';

export default function () {
  return function sortByLastMessageTime(hook) {
    if (hook.params.provider) {
      hook.result.data = _.orderBy(hook.result.data, ['lastMessageTime'], ['desc']);
    }
    return hook;
  };
}
