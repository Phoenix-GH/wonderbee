/**
 * Created by BaeBae on 9/14/16.
 */
import crypto from 'crypto';
export default function () {
  return function updateGroupMemberHash(hook) {
    const { requestType } = hook.data;
    if (hook.params.provider && requestType === 'leaveGroup' || requestType === 'addGroupUsers') {
      const groupMap = hook.app.service('groupUsers');
      const query = {
        groupId: hook.id,
        deleted: false,
      };
      return groupMap.find({ query, paginate: false })
        .then((result) => {
          if (result.data.length > 0) {
            const users = result.data
              .map(user => user.userId)
              .sort((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
              .join('-')
              .toString();
            const hash = crypto.createHash('sha256').update(users).digest('hex');
            const groupMemberHash = hash;
            return this.patch(hook.id, { groupMemberHash })
              .then(() => hook);
          }
          return hook;
        });
    }
    return hook;
  };
}
