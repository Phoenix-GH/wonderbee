import { before, after, facebookAuth } from './hooks';

export default function () {
  const app = this;
  app.service('auth/token').before(before).after(after);
  app.service('auth/local').before(before).after(after);
  app.service('auth/facebook').before(facebookAuth.before).after(facebookAuth.after);
}
