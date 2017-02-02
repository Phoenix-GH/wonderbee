import { disable, removeQuery } from 'feathers-hooks';
import auth from 'feathers-authentication';
import populate from '../../../hooks/populate';
import moment from '../../../hooks/moment';
import { convertToJSON } from '../../../hooks';
import attachVoteCount from './attachVoteCount';
import attachVoteStatus from './attachVoteStatus';
import attachReplyCount from './attachReplyCount';
import attachFollowerCount from './attachFollowerCount';
import sendNotification from './sendNotification';
import attachCommentString from './attachCommentString';
import attachWeight from './attachWeight';
import removeSortBy from './removeSortBy';
import removeNested from './removeNested';

const momentCreatedAt = {
  field: 'createdAt',
  dest: 'ago',
  options: {
    fn: 'fromNow',
  },
};

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    removeSortBy(),
  ],
  get: [],
  create: [
    auth.hooks.associateCurrentUser(),
    attachWeight(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.restrictToOwner(),
  ],
  remove: [],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    populate('createdBy', { service: 'users', field: 'userId' }),
    attachVoteCount(1), // upvotes
    attachVoteCount(-1), // downvotes
    attachVoteStatus(), // upvoted or downvoted (based on current user)
    attachReplyCount(),
    attachFollowerCount(),
    attachCommentString(),
    moment(momentCreatedAt),
  ],
  get: [
    populate('createdBy', { service: 'users', field: 'userId' }),
  ],
  create: [
    sendNotification(),
    populate('createdBy', { service: 'users', field: 'userId' }),
    attachVoteCount(), // upvotes & downvotes
    attachVoteStatus(), // upvoted or downvoted (based on current user)
    attachReplyCount(),
    attachCommentString(),
    moment(momentCreatedAt),
  ],
  update: [],
  patch: [],
  remove: [
    removeNested(),
  ],
};
