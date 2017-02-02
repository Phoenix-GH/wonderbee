export default function () {
  return function addNewAdmin(hook) {
    if (hook.params.provider) {
      return this.get(hook.id)
      .then(map => {
        if (map.isAdmin) {
          const query = {
            groupId: map.groupId,
            deleted: false,
            $limit: 1,
            $sort: { createdAt: -1 },
          };
          return this.find({ query, paginate: false })
          .then(newAdmin => this.patch(newAdmin[0].id, { isAdmin: true }))
          .catch(error => console.log(error));
        }
        return hook;
      })
      .catch(error => console.log(error));
    }
    return hook;
  };
}
