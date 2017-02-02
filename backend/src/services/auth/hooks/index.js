import checkUnique from './checkUnique';
import facebookSignup from './facebookSignup';
import noCaseSensitive from '../../../hooks/noCaseSensitive';

export const before = {
  all: [],
  find: [
    noCaseSensitive('username'),
  ],
  get: [
    noCaseSensitive('username'),
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

export const after = {
  all: [
  ],
  find: [],
  get: [],
  create: [
    checkUnique(),
  ],
  update: [],
  patch: [],
  remove: [],
};

export const facebookAuth = {
  before: {
    all: [
      facebookSignup(),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
