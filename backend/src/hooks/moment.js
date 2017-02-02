import moment from 'moment';
import _ from 'lodash';

const _moment = (target, field, dest, options) => {
  const {
    fn = 'fromNow',
    args,
    reverse,
  } = options;

  if (!_.isArray(target)) {
    const momentInstance = moment(target[field]);
    target[dest] = momentInstance[fn](args);
    if (reverse) {
      target[dest] = !target[dest];
    }
    return target;
  }

  return target.map((obj) => {
    if (!obj.hasOwnProperty(field) || !obj[field]) {
      return obj;
    }
    const momentInstance = moment(obj[field]);
    const newObj = Object.assign({}, obj, {
      [dest]: momentInstance[fn](args),
    });

    if (reverse) {
      newObj[dest] = !newObj[dest];
    }

    return newObj;
  });
};

export default function ({ field, dest, options }) {
  return function (hook) {
    if (hook.type === 'before') {
      return hook;
    }
    if (_.isArray(hook.result)) {
      hook.result = _moment(hook.result, field, dest, options);
    } else if (_.isArray(hook.result.data)) {
      hook.result.data = _moment(hook.result.data, field, dest, options);
    } else if (_.isObject(hook.result)) {
      hook.result = _moment(hook.result, field, dest, options);
    }
    return hook;
  };
}
