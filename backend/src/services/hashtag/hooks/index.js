import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import upsertHashtag from './upsertHashtag';
import attachPostsCount from './attachPostsCount';

export const before = {
  all: [
    auth.hooks.verifyToken(),
  ],
  find: [],
  get: [],
  create: [
    upsertHashtag(),
  ],
  update: [],
  patch: [],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [],
  find: [
    attachPostsCount(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
