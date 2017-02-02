import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;
  // initialize the service with options
  app.use('/facebook', memory());
  app.service('facebook').before(before).after(after);
}
