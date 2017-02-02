import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [],
  get: [],
  create: [
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    disable(),
  ],
  patch: [],
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
