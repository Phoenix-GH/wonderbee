import service from 'feathers-sequelize';
import flagCommentModel from './model';

export default function init() {
  const app = this;

  const options = {
    Model: flagCommentModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/flagComments', service(options));
}
