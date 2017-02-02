import memory from 'feathers-memory';
import { before, after } from './hooks';

export default function init() {
  const app = this;
  app.use('/resetPassword', memory());
  app.service('resetPassword').before(before).after(after);
}
