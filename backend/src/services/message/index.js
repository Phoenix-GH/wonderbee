import service from 'feathers-sequelize';
import messageModel from './model';
import { before, after } from './hooks';
import { filters } from './filters';

export default function init() {
  const app = this;

  const options = {
    Model: messageModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/messages', service(options));

  // setup hooks
  app.service('messages').before(before).after(after);

  // setup filters
  app.service('messages').filter(filters);
}
