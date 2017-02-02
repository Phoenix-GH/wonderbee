export default function init() {
  const app = this;
  app.get('/confirmReset', (req, res, next) => {
    if (req.query.token) {
      const token = /token=(.*)/g.exec(req.url)[1];
      res.render('resetPassword', { token });
    } else {
      next();
    }
  });

  app.post('/confirmReset', (req, res) => {
    let token = '';
    if (req.body.token) {
      token = req.body.token;
    } else {
      throw new Error('No token provided.');
    }
    return app.service('users').find({ query: { passwordResetToken: token } }).then(
      (user) => Promise.all([
        app.service('users').patch(
          user[0].id,
          { password: req.body.password, passwordResetToken: null }
        ),
      ])
    )
    .then(
      () => res.render('resetSuccess')
    )
    .catch(err => console.log(err));
  });
}
