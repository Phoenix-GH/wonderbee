import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import cleanResponse from './cleanResponse';
import attachPath from './attachPath';

export const before = {
  all: [
    // auth.hooks.verifyToken(),
    // auth.hooks.populateUser(),
  ],
  find: [],
  get: [],
  create: [
    attachPath(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.restrictToOwner(),
  ],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [],
  find: [],
  get: [],
  create: [
    cleanResponse(),
  ],
  update: [],
  patch: [],
  remove: [],
};
