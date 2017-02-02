import crypto from 'crypto';

export default function () {
  return function attachUserHash(hook) {
    const users = hook.data.userArray.concat(hook.params.user.id)
      .sort((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
      .join('-');
    const hash = crypto.createHash('sha256').update(users).digest('hex');
    hook.data.groupMemberHash = hash;
    return hook;
  };
}
