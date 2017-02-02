import { ServiceCountSum } from '../../custom-services';
import emojiModel from './model';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  const options = {
    Model: emojiModel(app.get('sequelize')),
  };

  // initialize the service with options
  app.use('/emojis', new ServiceCountSum(options));

  // setup hooks
  app.service('emojis').before(before).after(after);
}
