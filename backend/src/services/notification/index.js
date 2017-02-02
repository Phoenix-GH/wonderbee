import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;
  // initialize the service
  app.use('/notifications', memory());

  // setup hooks
  app.service('notifications').before(before).after(after);
}
