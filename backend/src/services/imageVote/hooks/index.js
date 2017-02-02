import { disable, remove } from 'feathers-hooks';
import auth from 'feathers-authentication';
import moment from 'moment';
import { convertToJSON, attachUsersWhoVoted } from '../../../hooks';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [],
  get: [],
  create: [
    disable((hook) =>
      hook.app.service('posts').get(hook.data.postId)
      .then(post => !moment(post.expiredAt).isBefore())
    ),
    remove('postId'),
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    disable(),
  ],
  patch: [
    disable(),
  ],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    attachUsersWhoVoted(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
