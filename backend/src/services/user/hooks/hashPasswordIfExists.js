import auth from 'feathers-authentication';

export default function (passwordField) {
  return function hashPasswordIfExists(hook) {
    if (!!hook.data.password) {
      return auth.hooks.hashPassword(passwordField)(hook);
    }
    return hook;
  };
}
