export default function () {
  return function sortDescending(hook) {
    if (hook.params.provider) {
      hook.params.query.$sort = { createdAt: -1 };
    }
    return hook;
  };
}
