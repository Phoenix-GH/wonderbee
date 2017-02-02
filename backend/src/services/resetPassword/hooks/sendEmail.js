export default function sendEmail() {
  return (hook) => {
    console.log('target email: ', hook.result.email);
    const resetLink = `http://${hook.app.get('host')}:${hook.app.get('port')}/confirmReset?token=${hook.result.token}`;
    const message = {
      from: hook.app.get('mailgun').sender,
      to: hook.result.email, // 'harouf@outlook.com'
      subject: 'Please reset your password',
      html: `Try to follow the given link to complete reset process. <br/><a href="${resetLink}">${resetLink}</a>`,
    };
    hook.app.service('mailer').create(message).then(
      (result) => { console.log('email result: ', result); }
    )
    .catch(
      (err) => { console.log('email error: ', err); }
    );
    return hook;
  };
}
