import { disable } from 'feathers-hooks';
import createResetToken from './createResetToken';
import sendEmail from './sendEmail';

export const before = {
  all: [],
  find: [],
  get: [
    disable(),
  ],
  create: [
    createResetToken(),
  ],
  update: [
    disable(),
  ],
  patch: [
    disable(),
  ],
  remove: [
    disable('external'),
  ],
};

export const after = {
  all: [],
  find: [],
  get: [],
  create: [
    sendEmail(),
  ],
  update: [],
  patch: [],
  remove: [],
};
