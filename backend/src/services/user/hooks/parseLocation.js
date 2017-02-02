import _ from 'lodash';

export default function () {
  return function parseLocation(hook) {
    if (hook.data && _.isString(hook.data.location)) {
      const [city, state] = String(hook.data.location).split(',').map(str => str.trim());
      hook.data.location = { city, state };
    }
    return hook;
  };
}
