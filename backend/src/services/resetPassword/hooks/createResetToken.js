import validator from 'validator';
import crypto from 'crypto';
import cryptoJS from 'crypto-js';
import sha512 from 'crypto-js/sha512';
import _ from 'lodash';
import errors from 'feathers-errors';

export default function () {
  return function checkResetToken(hook) {
    const userInfo = _.toString(hook.data.userInfo);
    const query = validator.isEmail(userInfo) ?
      { email: userInfo } : { username: userInfo };
    return hook.app.service('users').find({ query })
    .then(user => {
      if (!user.length) {
        throw new errors.NotFound('The email or username did not match a user');
      }
      const salt = crypto.randomBytes(48).toString('base64');
      const passwordResetToken = sha512(salt + user[0].email).toString(cryptoJS.enc.Base64);
      return hook.app.service('users').patch(user[0].id, { passwordResetToken });
    })
    .then((u) => {
      hook.data.userId = u.id;
      hook.data.email = u.email;
      hook.data.token = u.passwordResetToken;
      return hook;
    });
  };
}
