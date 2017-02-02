export default function () {
  return function addDeleteText(hook) {
    if (hook.params.provider) {
      hook.result.data.forEach((thread, i) => {
        hook.result.data[i].deleteText = thread.hidden ? 'Delete' : 'Leave Group';
      });
    }
    return hook;
  };
}
