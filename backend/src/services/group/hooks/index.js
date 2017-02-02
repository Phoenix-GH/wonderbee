import { remove } from 'feathers-hooks';
import auth from 'feathers-authentication';
import findAllGroups from './findAllGroups';
import createMapping from './createMapping';
import addUserCount from './addUserCount';
import createUpdatedString from './createUpdatedString';
import updateRead from './updateRead';
import addDeleteText from './addDeleteText';
import addLastMessage from './addLastMessage';
import addUnreadCount from './addUnreadCount';
import sortByLastMessageTime from './sortByLastMessageTime';
import attachUserHash from './attachUserHash';
import findWithHash from './findWithHash';
import attachGroupMap from './attachGroupMap';
import addThreadName from './addThreadName';
import uploadAvatar from './uploadAvatar';
import leaveGroup from './leaveGroup';
import updateGroupMemberHash from './updateGroupMemberHash';
import addGroupUsers from './addGroupUsers';
import checkGroupNameChanged from './checkGroupNameChanged';
import { convertToJSON, normalizeResult } from '../../../hooks';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    findAllGroups(),
    findWithHash(),
  ],
  get: [
    auth.hooks.queryWithCurrentUser(),
  ],
  create: [
    auth.hooks.associateCurrentUser(),
    attachUserHash(),
    remove('userArray', (hook) => {
      hook._data = Object.assign({}, hook.data);
      return true;
    }),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    updateRead(),
    uploadAvatar(),
  ],
  remove: [
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    normalizeResult(),
    attachGroupMap(),
    addThreadName(),
    addUserCount(),
    addLastMessage(),
    addUnreadCount(),
    createUpdatedString(),
    addDeleteText(),
    sortByLastMessageTime(),
  ],
  get: [],
  create: [
    createMapping(),
  ],
  patch: [
    leaveGroup(),
    checkGroupNameChanged(),
    addGroupUsers(),
    updateGroupMemberHash(),
  ],
};
