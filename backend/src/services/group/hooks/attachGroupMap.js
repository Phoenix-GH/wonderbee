export default function () {
  return function attachGroupMap(hook) {
    if (hook.params.provider && hook.params._groupMaps) {
      hook.result.data.forEach((group, i) => {
        const { _groupMaps } = hook.params;
        const groupMap = _groupMaps.data.filter(map => group.id.toString() === map.groupId)[0];
        hook.result.data[i] = {
          ...group,
          read: groupMap.read,
          involvedString: groupMap.involvedString,
          lastMessage: groupMap.lastMessage,
          lastReadAt: groupMap.updatedAt,
          isAdmin: groupMap.isAdmin,
          avatarUrl: group.hidden ? groupMap.involved[0].avatarUrl : group.avatarUrl,
        };
      });
    }
    return hook;
  };
}
