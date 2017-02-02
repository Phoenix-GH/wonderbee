import { Service } from 'feathers-sequelize';
import sequelize from 'sequelize';

export default class ServiceCountSum extends Service {
  count(where) {
    return this.Model.count({ where })
    .then(result => result)
    .catch(error => console.log(error));
  }

  sum(field, where) {
    return this.Model.sum(field, { where })
    .then(result => result)
    .catch(error => console.log(error));
  }

  bulkCreate(arr) {
    return this.Model.bulkCreate(arr);
  }

  groupByAndCount(groupByField, countField, where) {
    return this.Model.findAll({
      attributes: [groupByField, [sequelize.fn('count', sequelize.col('id')), countField]],
      where,
      group: [groupByField],
    })
    .then(results => results.map(result => result.toJSON()))
    .catch(error => console.log(error));
  }

  findAll(query) {
    return this.Model.findAll(query)
    .then(results => (
      { total: results.length, limit: this.paginate.default, skip: query.offset, data: results }
    ))
    .catch(error => console.log(error));
  }
}
