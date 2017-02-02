export default function () {
  return function (hook) {
    if (hook.result && Array.isArray(hook.result.results)) {
      hook.result = hook.result.results;
    }
    return hook;
  };
}
