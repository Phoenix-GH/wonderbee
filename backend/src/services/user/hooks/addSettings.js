export default function () {
  return function addSettings(hook) {
    hook.data.notificationSettings = {
      followRequest: true,
      colonyCopy: true,
      pin: true,
      feedback: true,
      directMessage: true,
      groupMessage: true,
      mutualFriend: true,
      comment: true,
      reply: true,
    };
    return hook;
  };
}
