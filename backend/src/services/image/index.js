import service from 'feathers-sequelize';
import imageModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: imageModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/images', service(options));

  // setup hooks
  app.service('images').before(before).after(after);
}
