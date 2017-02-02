export default function () {
  return function (hook) {
    if (typeof hook.data.email !== 'string') {
      return hook;
    }

    if (hook.data.email.split('@')[1] === 'gmail.com') {
      hook.data.rawGmail = hook.data.email;
    }

    return hook;
  };
}

export function isGmail() {
  return function (hook) {
    if (!hook.data || !hook.data.email) {
      hook.data.isGmail = false;
      return hook;
    }
    hook.data.isGmail = hook.data.email.split('@')[1].toLowerCase() === 'gmail.com';
    hook.data._gmail = hook.data.email.split('@')[0].replace(/\./g, '');
    return hook;
  };
}
