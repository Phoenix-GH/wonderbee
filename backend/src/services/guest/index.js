import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;
  app.use('/guest', memory());
  app.service('guest').before(before).after(after);
}
