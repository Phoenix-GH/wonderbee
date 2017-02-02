import { disable, remove } from 'feathers-hooks';
import auth from 'feathers-authentication';
import addFollowCount from './addFollowCount';
import attachUserId from './attachUserId';
import checkFollowing from './checkFollowing';
import addPostCount from './addPostCount';
import addSettings from './addSettings';
import checkIfUserExists from './checkIfUserExists';
import hashPasswordIfExists from './hashPasswordIfExists';
import updatePassword from './updatePassword';
import parseLocation from './parseLocation';
import addMutuals from './addMutuals';
import saveLocation from '../../../hooks/saveLocation';
import usernameValidation from './usernameValidation';
import attachLocation from './attachLocation';
import addSNSArn from './addSNSArn';
import addColonyCount from './addColonyCount';
import rawGmail, { isGmail } from './rawGmail';
import { convertToJSON } from '../../../hooks';
import uploadAvatar from './uploadAvatar';
import noCaseSensitive from '../../../hooks/noCaseSensitive';
import updatePostsVisibility from './updatePostsVisibility';

export const before = {
  all: [],
  find: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
    noCaseSensitive('username'),
  ],
  get: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  create: [
    auth.hooks.hashPassword(),
    isGmail(),
    checkIfUserExists(),
    addSettings(),
    saveLocation(),
    rawGmail(),
    usernameValidation(),
  ],
  update: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  patch: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
    addSNSArn(),
    attachUserId(),
    parseLocation(),
    hashPasswordIfExists(),
    updatePassword(),
    uploadAvatar(),
    saveLocation(),
    updatePostsVisibility(),
  ],
  remove: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
    disable(),
  ],
};

export const after = {
  all: [
    convertToJSON(),
    remove('password'),
  ],
  find: [],
  get: [
    addFollowCount(true), // followers
    addFollowCount(false), // following
    checkFollowing(),
    attachLocation(),
    addPostCount(),
    addColonyCount(),
    addMutuals(),
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
