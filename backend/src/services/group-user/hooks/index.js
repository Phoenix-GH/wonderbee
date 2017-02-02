import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import populate from '../../../hooks/populate';
import { convertToJSON, normalizeResult } from '../../../hooks';
import attachInvolvedArray from './attachInvolvedArray';
import checkRead from './checkRead';
import addInvolvedString from './addInvolvedString';
import addNewAdmin from './addNewAdmin';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [],
  get: [],
  create: [],
  update: [
    disable(),
  ],
  patch: [
  ],
  remove: [
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    populate('userInfo', { service: 'users', field: 'userId' }),
    normalizeResult(),
    checkRead(),
    attachInvolvedArray(),
    addInvolvedString(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
