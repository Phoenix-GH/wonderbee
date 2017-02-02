import service from 'feathers-sequelize';
import groupModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: groupModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/groups', service(options));

  // setup hooks
  app.service('groups').before(before).after(after);
}
