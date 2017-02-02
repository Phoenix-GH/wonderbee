import { disable } from 'feathers-hooks';
import populate from '../../../hooks/populate';
import sendNotification from './sendNotification';

export const before = {
  all: [
    // auth.hooks.verifyToken(),
    // auth.hooks.populateUser(),
  ],
  find: [
  ],
  get: [
    disable(),
  ],
  create: [
    sendNotification(),
  ],
  update: [
    disable(),
  ],
  patch: [
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
