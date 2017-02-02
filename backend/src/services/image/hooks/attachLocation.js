const attachOneLocation = (hook) => {
  const { locationId } = hook.result;
  const { app } = hook;
  if (!locationId) {
    return hook;
  }
  return app.service('locations').get(locationId)
    .then((rawData) => {
      hook.result.location = rawData;
      return hook;
    })
    .catch(() => hook);
};

const attachMultipleLocations = (hook) => {
  const locationService = hook.app.service('locations');
  const targetData = hook.result;
  const promises = targetData.map(res => {
    if (!res.locationId) {
      return void(0);
    }
    return locationService.get(res.locationId);
  });

  return Promise.all(promises)
    .then(locations => {
      hook.result = targetData.map((res, index) => ({
        ...res,
        location: locations[index],
      }));
    })
    .then(() => hook)
    .catch(err => console.log(err));
};

export default function () {
  return function (hook) {
    if (hook.params.provider) {
      switch (hook.method.toLowerCase()) {
        case 'get':
          return attachOneLocation(hook);
        case 'find':
          return attachMultipleLocations(hook);
        default:
          return hook;
      }
    }
    return hook;
  };
}
