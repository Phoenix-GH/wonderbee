import { convertToJSON } from '../../../hooks';

export const before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
