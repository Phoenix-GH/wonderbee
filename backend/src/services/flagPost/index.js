import service from 'feathers-sequelize';
import flagPostModel from './model';

export default function init() {
  const app = this;

  const options = {
    Model: flagPostModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/flagPosts', service(options));
}
