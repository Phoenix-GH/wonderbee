export default function () {
  return function attachUserId(hook) {
    if (hook.params.user) {
      hook.id = hook.params.user.id;
    }
    return hook;
  };
}
