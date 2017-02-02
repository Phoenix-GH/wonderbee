export default function () {
  return function sortByOrder(hook) {
    hook.params.query = {
      $sort: { order: 1 },
      ...hook.params.query,
    };
    return hook;
  };
}
