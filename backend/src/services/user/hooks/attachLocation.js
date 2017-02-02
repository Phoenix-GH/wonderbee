export default function () {
  return function (hook) {
    const { locationId } = hook.result;
    const { app } = hook;
    if (!locationId) {
      return hook;
    }
    return app.service('locations').get(locationId)
      .then((dataValues) => {
        hook.result.location = dataValues;
        return hook;
      })
      .catch(() => hook);
  };
}
