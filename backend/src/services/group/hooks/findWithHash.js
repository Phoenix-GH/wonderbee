import crypto from 'crypto';

export default function () {
  return function findWithHash(hook) {
    if (hook.params.provider && hook.params.query.groupMemberHash) {
      hook.params._query = Object.assign({}, hook.params.query);
      const users = hook.params.query.groupMemberHash
      .concat(hook.params.user)
      .map(user => user.id)
      .sort((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
      .join('-')
      .toString();
      const hash = crypto.createHash('sha256').update(users).digest('hex');
      hook.params.query.groupMemberHash = hash;
    }
    return hook;
  };
}
