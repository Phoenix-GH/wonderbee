import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import parseLocation from './parseLocation';
import findOrCreate from './findOrCreate';

export const before = {
  all: [
    auth.hooks.verifyToken(),
  ],
  find: [],
  get: [],
  create: [
    findOrCreate(),
  ],
  update: [],
  patch: [],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [],
  find: [],
  get: [
    parseLocation(),
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
