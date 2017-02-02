import { ServiceCountSum } from '../../custom-services';
import heatmapVoteModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: heatmapVoteModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/heatmapVotes', new ServiceCountSum(options));

  // setup hooks
  app.service('heatmapVotes').before(before).after(after);
}
