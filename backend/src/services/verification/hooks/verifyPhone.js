export default function () {
  return function (hook) {
    const { app } = hook;
    const { phone, code } = hook.data;

    return app.service('verification').verifyPhone(phone, code)
      .then(data => (hook.result = data))
      .then(() => hook)
      .catch(err => {
        throw err;
      });
  };
}
