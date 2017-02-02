import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import { convertToJSON, attachUsersWhoVoted } from '../../../hooks';
import grabId from './grabId';

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
    auth.hooks.queryWithCurrentUser(),
    grabId(),
    auth.hooks.restrictToOwner(),
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
