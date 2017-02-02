import { ServiceCountSum } from '../../custom-services';
import colonyModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: colonyModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/colonies', new ServiceCountSum(options));

  // setup hooks
  app.service('colonies').before(before).after(after);
}
