import { disable } from 'feathers-hooks';
import checkRequest from './checkRequest';
import verifyToken from './verifyToken';

export const before = {
  all: [],
  find: [
    disable(),
  ],
  get: [
    disable(),
  ],
  create: [
    verifyToken(),
    checkRequest(),
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
