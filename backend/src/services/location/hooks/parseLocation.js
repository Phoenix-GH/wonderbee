export default function () {
  return function (hook) {
    const { name, longitude, latitude, type } = hook.result;

    if (name) {
      const _location = name.split(', ');
      const [city, state, country] = _location;

      hook.result = {
        longitude,
        latitude,
        type,
        city,
        state,
        country,
      };
    }
    return hook;
  };
}
