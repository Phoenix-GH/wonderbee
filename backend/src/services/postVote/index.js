import { PostVoteService } from './postVoteService';
import postVoteModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: postVoteModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/postVotes', new PostVoteService(options));

  // setup hooks
  app.service('postVotes').before(before).after(after);
}
