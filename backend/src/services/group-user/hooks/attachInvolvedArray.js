export default function () {
  return function addInvolvedArray(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((group, i) =>
        this.find({
          query: {
            groupId: group.groupId,
            $select: ['userId'],
            $limit: 5,
            userId: { $ne: hook.params.user.id },
          },
          paginate: false,
        })
        .then(userIds => (hook.result.data[i].involved = userIds.data))
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
