import { removeQuery } from 'feathers-hooks';
import auth from 'feathers-authentication';
import populate from '../../../hooks/populate';
import checkFollowing from './checkFollowing';
import createOrRemove from './createOrRemove';
import addFollowingKey from './addFollowingKey';
import multipleFollow from './multipleFollow';
import findMutual from './findMutual';
import sendNotification from './sendNotification';
import { convertToJSON } from '../../../hooks';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    findMutual(),
    removeQuery('requestType', 'field', (hook) => {
      hook.params._query = Object.assign({}, hook.params.query);
      return true;
    }),
  ],
  get: [],
  create: [
    auth.hooks.associateCurrentUser(),
    createOrRemove(),
    multipleFollow(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [],
  remove: [
    // auth.hooks.restrictToOwner(),
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    populate('createdUser', { service: 'users', field: 'userId' }),
    populate('followedUser', { service: 'users', field: 'followUserId' }),
    checkFollowing(),
  ],
  get: [
    populate('createdBy', { service: 'users', field: 'userId' }),
  ],
  create: [
    addFollowingKey(),
    sendNotification(),
  ],
  update: [],
  patch: [],
  remove: [
    addFollowingKey(),
  ],
};
