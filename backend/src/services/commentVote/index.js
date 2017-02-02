import { ServiceCountSum } from '../../custom-services';
import commentVoteModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: commentVoteModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/commentVotes', new ServiceCountSum(options));

  // setup hooks
  app.service('commentVotes').before(before).after(after);
}
