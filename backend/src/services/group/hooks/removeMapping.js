export default function () {
  return function removeMapping(hook) {
    const groupMap = hook.app.service('groupUsers');
    return this.get(hook.id)
    .then(result => {
      const query = {
        groupId: hook.id,
        userId: hook.params.user.id,
        $limit: 1,
      };
      return (groupMap.find({ query, paginate: false }))
      .then(map =>
        (result.hidden ? groupMap.patch(map[0].id, { deleted: true }) : groupMap.remove(map[0].id))
      )
      .then(removedEntry => {
        hook.result = removedEntry;
        return hook;
      })
      .catch(error => console.log(error));
    });
  };
}
