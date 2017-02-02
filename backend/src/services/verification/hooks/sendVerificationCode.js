import Random from 'random-js';

export default function () {
  return function (hook) {
    const { phone } = hook.data;
    const { app } = hook;
    const randomEngine = Random.engines.nativeMath;
    const verificationCode = Random.integer(1000, 9999)(randomEngine);

    const smsData = {
      data: {
        message: `JustHive Phone Verification Code: ${verificationCode}`,
        recipient: phone,
      },
      type: 'sms',
    };

    return app.service('notifications').create(smsData)
      .then(() => hook.data = { phone, verificationCode })
      .then(() => hook)
      .catch(err => {
        throw err;
      });
  };
}
