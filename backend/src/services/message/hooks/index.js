import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import populate from '../../../hooks/populate';
import moment from '../../../hooks/moment';
import attachPreviousMessageTime from './attachPreviousMessageTime';
import attachCreatedBy from './attachCreatedBy';
import sortDesc from './sortDesc';
import createGroup from './createGroup';
import sendNotification from './sendNotification';
import ifInGroup from './ifInGroup';
import addCreatedAt from './addCreatedAt';
import { convertToJSON } from '../../../hooks';

const momentToLT = {
  field: 'updatedAt',
  dest: 'ago',
  options: {
    fn: 'format',
    args: 'LT',
  },
};

const momentToLL = {
  field: 'updatedAt',
  dest: 'date',
  options: {
    fn: 'format',
    args: 'LL',
  },
};

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    addCreatedAt(),
    sortDesc(),
  ],
  get: [],
  create: [
    createGroup(),
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.restrictToOwner(),
  ],
  remove: [
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    attachCreatedBy(),
    attachPreviousMessageTime(),
    moment(momentToLT),
    moment(momentToLL),
  ],
  get: [
    populate('createdBy', { service: 'users', field: 'userId' }),
  ],
  create: [
    populate('createdBy', { service: 'users', field: 'userId' }),
    ifInGroup(),
    moment(momentToLT),
    sendNotification(),
  ],
};
