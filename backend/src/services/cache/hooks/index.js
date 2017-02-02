import { disable } from 'feathers-hooks';
import getItem from './getItem';
import setItem from './setItem';
import patchItem from './patchItem';
import removeItem from './removeItem';

export const before = {
  all: [
    disable('external'),
  ],
  find: [
    disable(),
  ],
  get: [
    getItem(),
  ],
  create: [
    setItem(),
  ],
  update: [
    setItem(),
  ],
  patch: [
    patchItem(),
  ],
  remove: [
    removeItem(),
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
