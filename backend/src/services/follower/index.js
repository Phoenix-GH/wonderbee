import followerModel from './model';
import FollowerService from './followerService';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: followerModel(app.get('sequelize')),
    paginate: {
      default: 10,
      max: 100,
    },
  };

  // initialize the service with options
  app.use('/followers', new FollowerService(options));

  // / setup hooks
  app.service('followers').before(before).after(after);
}
