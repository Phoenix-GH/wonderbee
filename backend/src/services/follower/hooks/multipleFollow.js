import _ from 'lodash';

function createPushDataArray(users) {
  return users.map((user) => ({
    id: user.id,
    isPrivate: user.private,
  }));
}

export default function () {
  return function (hook) {
    if (!Array.isArray(hook.data.people)) {
      return hook;
    }

    const { people } = hook.data;
    const { user } = hook.params;

    let createArray;

    return hook.app.service('users').Model.findAll({
      where: {
        id: { $in: people },
      },
      attributes: ['id', 'private'],
    })
    .then(data => {
      hook._usersToFollow = createPushDataArray(data);
      return _.keyBy(data, 'id');
    })
    .then(users => {
      createArray = people.map(id => ({
        userId: user.id,
        followUserId: id,
        approved: !users[id].private,
      }));
    })
    .then(() => this.bulkCreate(createArray))
    .then(result => {
      hook.result = result;
    })
    .then(() => hook)
    .catch(err => {
      throw new Error(err);
    });
  };
}
