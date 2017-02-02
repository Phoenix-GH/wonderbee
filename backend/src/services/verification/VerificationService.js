import Memory from 'feathers-memory';
import _ from 'lodash';
import errors from 'feathers-errors';

export class VerificationService extends Memory.Service {
  verifyPhone(phone, verificationCode) {
    return new Promise((resolve, reject) => {
      const query = { phone, verificationCode };
      query.verificationCode = parseInt(query.verificationCode, 10);
      const phoneObject = _.find(this.store, query);

      if (!phoneObject) {
        return reject(errors.NotFound('Invalid verification code'));
      }
      delete this.store[phoneObject.id];
      return resolve(true);
    });
  }
}
