import Sequelize from 'sequelize';

export default function (field) {
  return function (hook) {
    if (!hook.params.query || !hook.params.query[field]) {
      return hook;
    }
    const fieldValue = hook.params.query[field];
    hook.params.query[field] = Sequelize.where(
      Sequelize.fn('lower', Sequelize.col(field)),
      Sequelize.fn('lower', fieldValue)
    );
    return hook;
  };
}
