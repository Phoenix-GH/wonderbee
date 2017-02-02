import groupUserModel from './model';
import { before, after } from './hooks';
import { ServiceCountSum } from '../../custom-services';

export default function init() {
  const app = this;

  const options = {
    Model: groupUserModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/groupUsers', new ServiceCountSum(options));

  // setup hooks
  app.service('groupUsers').before(before).after(after);
}
