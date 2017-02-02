export default function (setPresets) {
  return function groupByPresets(hook) {
    if (hook._query && hook._query.presets) {
      const presets = {};
      Object.keys(setPresets).forEach(key => {
        presets[key] = hook.result.filter(item => setPresets[key].indexOf(item.id) > -1);
      });
      hook.result = Object.assign({}, { ...presets });
    }
    return hook;
  };
}
