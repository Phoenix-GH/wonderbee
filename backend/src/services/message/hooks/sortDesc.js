export default function () {
  return function sortDesc(hook) {
    if (hook.params.query) {
      hook.params.query.$sort = { createdAt: -1 };
    }
  };
}
