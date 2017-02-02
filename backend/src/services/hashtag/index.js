import service from 'feathers-sequelize';
import hashtagModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: hashtagModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/hashtags', service(options));

  // setup hooks
  app.service('hashtags').before(before).after(after);
}
