import request from 'request';
import errors from 'feathers-errors';

export default function () {
  return function findFacebookFriends(hook) {
    if (hook.id === 'facebook') {
      const { user } = hook.params;
      if (!user.facebookOAuthToken || !user.facebookOAuthTokenExpiresAt) {
        throw new errors.BadRequest('Facebook authentication required.');
      } else if ((new Date().getTime() / 1000) > user.facebookOAuthTokenExpiresAt) {
        throw new errors.BadRequest('Token expired.');
      } else {
        return new Promise((resolve, reject) => {
          request(`https://graph.facebook.com/v2.7/me/friends?access_token=${user.facebookOAuthToken}&fields=id,name,picture`,
            (err, res, body) => {
              if (err) {
                return reject(err);
              }
              return resolve(JSON.parse(body));
            });
        }).then((friends) => {
          hook.id = 0;
          hook.result = friends.data.map((f) => ({
            id: f.id, name: f.name, avatarUrl: f.picture.data.url,
          }));
          return hook;
        });
      }
    }
    return hook;
  };
}
