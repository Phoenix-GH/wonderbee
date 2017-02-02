/**
 * Created by BaeBae on 9/14/16.
 */

export default function () {
  function createSystemMessage(hook) {
    const message = hook.app.service('messages');
    const title = hook.data.name;
    const content = `${hook.params.user.name} changed the title to ‘${title}’`;
    return message.create({
      groupId: hook.id,
      userId: 0,
      content,
    });
  }

  return function checkGroupNameChanged(hook) {
    if (hook.params.provider && hook.data.requestType === 'renameGroup') {
      return createSystemMessage(hook)
        .then(() => hook);
    }
    return hook;
  };
}
