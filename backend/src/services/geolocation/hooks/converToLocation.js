import errors from 'feathers-errors';

export default function () {
  return function (hook) {
    const { latitude, longitude } = hook.params.query;
    if (!latitude || !longitude) {
      throw new errors.NotAcceptable('Missing Coordinates');
    }
    hook.params.query.location = `${latitude},${longitude}`;
    delete hook.params.query.latitude;
    delete hook.params.query.longitude;
    return hook;
  };
}
