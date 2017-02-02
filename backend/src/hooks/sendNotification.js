function createNotification(hook, notification) {
  return hook.app.service('notifications').create(notification);
}

export default function sendNotification(parseResult) {
  if (typeof parseResult !== 'function') {
    throw new Error('parseResult should be a function');
  }
  return function notification(hook) {
    if (!hook.params.provider) {
      return hook;
    }
    const parsedResult = parseResult(hook.result);
    if (!Array.isArray(parsedResult)) {
      return createNotification(hook, parsedResult);
    }
    // for performance purposes
    for (let i = 0; i < parseResult.length; i++) {
      createNotification(parseResult(hook, parseResult[i]));
    }
  };
}
