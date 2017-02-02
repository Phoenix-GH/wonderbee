import errors from 'feathers-errors';
import bcrypt from 'bcryptjs';

export default function () {
  return function updatePassword(hook) {
    if (hook.params.provider && !!hook.data.updatePassword) {
      const { currentPassword } = hook.data;
      if (!bcrypt.compareSync(currentPassword, hook.params.user.password)) {
        return new Promise(
          (resolve, reject) => reject(new errors.BadRequest('Current password is not correct.'))
        );
      }
    }
    return hook;
  };
}
