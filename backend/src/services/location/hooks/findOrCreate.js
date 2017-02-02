export default function () {
  return function (hook) {
    const { name, latitude, longitude } = hook.data;
    const query = { name, $limit: 1 };
    if (!!latitude) {
      query.latitude = latitude;
    }
    if (!!longitude) {
      query.longitude = longitude;
    }
    return this.find({ query })
      .then((raw) => {
        if (raw && raw.length) {
          hook.result = raw[0];
        }
        return hook;
      })
      .catch(() => {
        return hook;
      });
  };
}
