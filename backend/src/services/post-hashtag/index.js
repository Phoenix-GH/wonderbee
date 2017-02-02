import service from 'feathers-sequelize';
import { before, after } from './hooks';
import postHashtagModel from './model';

export default function init() {
  const app = this;

  const options = {
    Model: postHashtagModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/postHashtag', service(options));

  // setup hooks
  app.service('postHashtag').before(before).after(after);
}
