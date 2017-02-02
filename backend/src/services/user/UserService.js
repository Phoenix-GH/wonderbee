import { Service } from 'feathers-sequelize';
import Sequelize from 'sequelize';
import errors from 'feathers-errors';

export default class UserService extends Service {
  exists(data) {
    const $or = [];
    Object.keys(data).forEach(key => $or.push({ [key]: data[key] }));
    const query = { $or };
    return super.find({ query })
      .then(results => (
        results.length > 0 && new errors.BadRequest('User already exists')
      ))
      .catch(error => console.log(error));
  }

  findAll(query) {
    const where = Object.assign({}, query);
    /* where.username = where.username ?
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('username')),
        Sequelize.fn('lower', where.username)
      ) : void(0);
      */

    return this.Model.findAll({ where })
      .then(results => results.map(result => result.toJSON()))
      .catch(error => console.log(error));
  }
}
