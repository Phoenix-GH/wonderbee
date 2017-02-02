import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  // initialize the service
  app.use('/cache', memory());

  // setup hooks
  app.service('cache').before(before).after(after);
}
