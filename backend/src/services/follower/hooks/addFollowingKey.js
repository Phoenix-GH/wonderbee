export default function () {
  return function addFollowingKey(hook) {
    if (hook.method === 'remove') {
      hook.result.following = false;
    }
    if (!hook.result.hasOwnProperty('following')) {
      hook.result.following = true;
    }
    return hook;
  };
}
