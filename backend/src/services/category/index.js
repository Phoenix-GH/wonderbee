import service from 'feathers-sequelize';
import categoryModel from './model';

export default function init() {
  const app = this;

  const options = {
    Model: categoryModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/categories', service(options));
}
