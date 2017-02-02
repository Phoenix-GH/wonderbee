import { disable, remove } from 'feathers-hooks';
import auth from 'feathers-authentication';
import sortByOrder from './sortByOrder';
import getVotes from './getVotes';
import checkVotes from './checkVotes';
import attachCommentCounts from './attachCommentCounts';
import insertImageTags from './insertImageTags';
import attachLocation from './attachLocation';
import attachImageTags from './attachImageTags';
import { convertToJSON } from '../../../hooks';
import { cloneDeep } from 'lodash';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    sortByOrder(),
  ],
  get: [],
  create: [
    remove('tags', (hook) => {
      if (hook.data.tags) {
        hook._data = {
          tags: cloneDeep(hook.data.tags),
        };
      }
      return true;
    }),
  ],
  update: [
    disable(),
  ],
  patch: [],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    getVotes(),
    checkVotes(),
    attachCommentCounts(),
    attachLocation(),
    attachImageTags(),
  ],
  get: [],
  create: [
    insertImageTags(),
  ],
  update: [],
  patch: [],
  remove: [],
};
