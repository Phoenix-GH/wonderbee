import service from 'feathers-sequelize';
import flagUserModel from './model';

export default function init() {
  const app = this;

  const options = {
    Model: flagUserModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/flagUsers', service(options));
}
