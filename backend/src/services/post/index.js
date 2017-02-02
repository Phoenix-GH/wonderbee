import { ServiceCountSum } from '../../custom-services';
import postModel from './model';
import { before, after } from './hooks';
import { filters } from './filters';

export default function init() {
  const app = this;

  const options = {
    Model: postModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 20,
    },
  };

  // initialize the service with options
  app.use('/posts', new ServiceCountSum(options));

  // setup hooks
  app.service('posts').before(before).after(after);

  // setup event filters
  app.service('posts').filter(filters);
}
