import errors from 'feathers-errors';

export default function () {
  return function (hook) {
    if (typeof hook.data.username !== 'string') {
      throw errors.Unprocessable('Invalid username');
    }
    const { username } = hook.data;
    const isCharcterInvalid = /[^a-z_A-Z0-9]/;

    if (isCharcterInvalid.test(username)) {
      throw errors.Unprocessable('Invalid username characters');
    }
  };
}
