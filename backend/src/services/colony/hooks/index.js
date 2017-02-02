import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import getAvatarImage from './getAvatarImage';
import patchOriginalColony from './patchOriginalColony';
import patchOriginalAndSoftDelete from './patchOriginalAndSoftDelete';
import findColonies from './findColonies';

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [
    findColonies(),
  ],
  get: [],
  create: [
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.restrictToOwner(),
  ],
  remove: [
    //patchOriginalAndSoftDelete(),
    //disable(),
  ],
};

export const after = {
  find: [
    getAvatarImage(),
  ],
  get: [
    getAvatarImage(),
  ],
  create: [
    //patchOriginalColony(),
  ],
};
