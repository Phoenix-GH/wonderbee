import { ServiceCountSum } from '../../custom-services';
import imageTagModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: imageTagModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/imageTags', new ServiceCountSum(options));

  // setup hooks
  app.service('imageTags').before(before).after(after);
}
