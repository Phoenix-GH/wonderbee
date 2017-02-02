import request from 'request';
import _ from 'lodash';

const getAccessToken = (clientID, clientSecret, code, redirectUri) => {
  const graphFacebookAccessTokenUrl = `https://graph.facebook.com/v2.7/oauth/access_token?code=${code}&client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`;

  return new Promise((resolve, reject) => {
    request(graphFacebookAccessTokenUrl, (err, response, body) => {
      if (err) {
        return reject(err);
      }
      // access_token=asldja;lkdsj;dlkjas&request=rerequest;
      const tokenData = JSON.parse(body);

      if (tokenData.error) {
        return reject(tokenData.error);
      }
      return resolve({
        accessToken: tokenData.access_token,
        expiresAt: _.toInteger(new Date().getTime() / 1000 + tokenData.expires_in),
      });
    });
  });
};

const getUserData = (token) => {
  const fields = 'id,email,name,gender,birthday,friends{id,name,picture},\
                  location,picture.type(large)';
  return new Promise((resolve, reject) => {
    request(`https://graph.facebook.com/me?access_token=${token.accessToken}&fields=${fields}`,
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(_.assign(JSON.parse(body), { token }));
      });
  });
};

export default function () {
  return function facebook(hook) {
    const { id, app } = hook;
    const { query } = hook.params;

    if (id !== 'callback') {
      return Promise.resolve(hook);
    }
    const { code } = query;
    if (!code) {
      return new Error(404, 'Code not found');
    }
    const { clientID, clientSecret } = app.get('auth').facebook;
    const redirectUri = `${app.get('host')}:${app.get('port')}${hook.params.req.originalUrl}`;
    hook.params.query.code = 'feathersJS HACK';
    getAccessToken(clientID, clientSecret, code, redirectUri)
      .then(token => {
        app.io.emit('fb:gettingUserData');
        return getUserData(token);
      })
      .then((user) => {
        app.io.emit('fb:userData', user);
        return hook;
      })
      .catch((err) => {
        app.io.emit('fb:error', err);
      });
    return null;
  };
}
