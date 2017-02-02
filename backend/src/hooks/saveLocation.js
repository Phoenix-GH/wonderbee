import errors from 'feathers-errors';

export default function () {
  return function (hook) {
    if (!hook.data.location || !hook.data.location.name) {
      return hook;
    }
    const { app } = hook;
    const { location } = hook.data;
    const { name, latitude, longitude } = location;
    return app.service('locations').create({ name, latitude, longitude })
      .then(rawLocation => {
        hook.data.locationId = rawLocation.id;
      })
      .then(() => hook)
      .catch(err => {
        throw new errors.Unprocessable(err);
      });
  };
}
