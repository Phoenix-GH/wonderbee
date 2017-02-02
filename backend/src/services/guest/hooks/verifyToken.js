import errors from 'feathers-errors';

export default function () {
  return function verifyToken(hook) {
    if (hook.params.provider === 'socketio') {
      let valid = false;
      const { validClients } = hook.app.get('auth');
      for (let i = 0; i < validClients.length; i++) {
        for (let j = 0; j < validClients[i].tokens.length; j++) {
          if (hook.data.token === validClients[i].tokens[j]) {
            valid = true;
            break;
          }
        }
        if (valid) {
          break;
        }
      }
      if (!valid) {
        return new errors.NotAuthenticated('You are not using a valid client');
      }
    }
    return hook;
  };
}
