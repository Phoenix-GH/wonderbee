import { ServiceCountSum } from '../../custom-services';
import commentModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: commentModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/comments', new ServiceCountSum(options));

  // setup hooks
  app.service('comments').before(before).after(after);
}
