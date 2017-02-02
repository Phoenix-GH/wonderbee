import auth from 'feathers-authentication';
import { disable } from 'feathers-hooks';
import findFacebookFriends from './findFacebookFriends';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    disable(),
  ],
  get: [
    findFacebookFriends(),
  ],
  create: [
    disable(),
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
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
