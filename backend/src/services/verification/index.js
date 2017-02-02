import { VerificationService } from './VerificationService';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  app.use('/verification', new VerificationService());

  app.service('verification').before(before).after(after);
}
