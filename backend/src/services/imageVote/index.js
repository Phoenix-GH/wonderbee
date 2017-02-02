import { ServiceCountSum } from '../../custom-services';
import imageVoteModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: imageVoteModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/imageVotes', new ServiceCountSum(options));

  // setup hooks
  app.service('imageVotes').before(before).after(after);
}
