import userModel from './model';
import { before, after } from './hooks';
import UserService from './UserService';

export default function init() {
  const app = this;

  const options = {
    Model: userModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/users', new UserService(options));

  // setup hooks
  app.service('users').before(before).after(after);
}
