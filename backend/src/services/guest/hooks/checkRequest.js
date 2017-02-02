export default function () {
  return function checkRequest(hook) {
    switch (hook.data.requestType) {
      case 'checkUnique': {
        const { email } = hook.data.checkValues;
        const checkValues = { ...hook.data.checkValues };
        if (email && email.split('@')[1].toLowerCase() === 'gmail.com') {
          checkValues.rawGmail = email.split('@')[0]
            .replace(/\./g, '')
            .toLowerCase();
          delete checkValues.email;
        }
        return hook.app.service(hook.data.model).exists(checkValues)
        .then(results => {
          hook.result = results;
          return hook;
        })
        .catch(error => console.log(error));
      }
      default: {
        hook.result = null;
        return hook;
      }
    }
  };
}
