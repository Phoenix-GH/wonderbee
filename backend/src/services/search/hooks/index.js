import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import parseRequest from './parseRequest';
import findUsers from './findUsers';
import findWithName from './findWithName';
import findColonies from './findColonies';
import findGroups from './findGroups';
import combineResults from './combineResults';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    disable(),
  ],
  get: [
    disable(),
  ],
  create: [
    parseRequest(),
    findUsers(),
    findColonies(),
    findWithName('locations'),
    findWithName('categories'),
    findWithName('hashtags'),
    findGroups(),
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
  create: [
    combineResults(),
  ],
  update: [],
  patch: [],
  remove: [],
};
