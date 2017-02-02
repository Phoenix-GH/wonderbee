import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;
  app.use('/search', memory());
  app.service('search').before(before).after(after);
}
