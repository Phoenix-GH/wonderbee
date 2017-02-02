import auth from 'feathers-authentication';
import { remove } from 'feathers-hooks';
import populate from '../../../hooks/populate';
import moment from '../../../hooks/moment';
import attachPostVotes from './attachPostVotes';
import attachComments from './attachComments';
import attachImages from './attachImages';
import checkVoted from './checkVoted';
import uploadImages from './uploadImages';
import insertImages from './insertImages';
import queryWithCurrentUser from './queryWithCurrentUser';
import sortDescending from './sortDescending';
import attachHeatmapVotes from './attachHeatmapVotes';
import attachEmojis from './attachEmojis';
import attachUserDetails from './attachUserDetails';
import findAndInsertHashtags from './findAndInsertHashtags';
import getResultsWithParams from './getResultsWithParams';
import attachDescriptionString from './attachDescriptionString';

const momentCreatedAt = {
  field: 'createdAt',
  dest: 'ago',
  options: {
    fn: 'fromNow',
  },
};

const momentIsAfter = {
  field: 'expiresAt',
  dest: 'isExpired',
  options: {
    fn: 'isAfter',
    reverse: true,
  },
};

const momentExpiresAt = {
  field: 'expiresAt',
  dest: 'formattedExpiresAt',
  options: {
    fn: 'fromNow',
    args: true,
  },
};

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    getResultsWithParams(),
    queryWithCurrentUser(),
    sortDescending(),
  ],
  get: [],
  create: [
    uploadImages(),
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.restrictToOwner(),
    remove('requestType', hook => {
      if (hook.data.requestType === 'expire') {
        hook.data = Object.assign({}, { expiresAt: new Date() });
      }
      return true;
    }),
  ],
  remove: [
    auth.hooks.restrictToOwner(),
  ],
};

export const after = {
  all: [],
  find: [
    populate('createdBy', { service: 'users', field: 'userId' }),
    attachEmojis(),
    attachPostVotes(),
    checkVoted(),
    attachComments(),
    attachImages(),
    attachHeatmapVotes(),
    attachUserDetails(),
    attachDescriptionString(),
    moment(momentCreatedAt),
    moment(momentIsAfter),
    moment(momentExpiresAt),
  ],
  get: [
    populate('createdBy', { service: 'users', field: 'userId' }),
  ],
  create: [
    insertImages(),
    findAndInsertHashtags(),
  ],
  update: [],
  patch: [],
  remove: [],
};
