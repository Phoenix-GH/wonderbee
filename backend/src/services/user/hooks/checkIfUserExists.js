import errors from 'feathers-errors';

export default function () {
  return function checkIfUserExists(hook) {
    if (hook.params.provider) {
      const { email, username, phone } = hook.data;
      if (!email && !phone) {
        return new errors.BadRequest('You need to supply a phone number or email');
      }
      if (!username) {
        return new errors.BadRequest('You need to supply a username');
      }

      const checkValues = {};
      if (hook.data.isGmail) {
        checkValues.rawGmail = hook.data._gmail;
      } else if (email) {
        checkValues.email = email;
      } else {
        checkValues.phone = phone;
      }
      const request = {
        requestType: 'checkUnique',
        model: 'users',
        checkValues,
      };
      return hook.app.service('guest').create(request)
      .then(result => {
        if (!result) {
          return hook;
        }
        throw result;
      });
    }
    return hook;
  };
}
