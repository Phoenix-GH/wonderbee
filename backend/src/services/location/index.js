import service from 'feathers-sequelize';
import locationModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: locationModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/locations', service(options));

  // setup hooks
  app.service('locations').before(before).after(after);
}
