import { disable, remove } from 'feathers-hooks';
import auth from 'feathers-authentication';
import findVotesByImageId from './findVotesByImageId';
import appendHeatmap from './appendHeatmap';
import validateImageId from './validateImageId';
import findClosestPosition from './findClosestPosition';
import getImageDims from './getImageDims';
import uploadHeatMap from './uploadHeatMap';
import attachUserVotes from './attachUserVotes';
import { convertToJSON, attachUsersWhoVoted } from '../../../hooks';
import moment from 'moment';
const POINT_RADIUS = 40;

export const before = {
  all: [
    auth.hooks.verifyToken(),
    auth.hooks.populateUser(),
  ],
  find: [],
  get: [
    findVotesByImageId(),
    attachUserVotes(),
    getImageDims(),
    appendHeatmap(POINT_RADIUS),
  ],
  create: [
    disable((hook) =>
      hook.app.service('posts').get(hook.data.postId)
      .then(post => !moment(post.expiredAt).isBefore())
    ),
    remove('postId'),
    validateImageId(),
    findClosestPosition(POINT_RADIUS),
    auth.hooks.associateCurrentUser(),
  ],
  update: [
    disable(),
  ],
  patch: [
    disable(),
  ],
  remove: [
    disable(),
  ],
};

export const after = {
  all: [
    convertToJSON(),
  ],
  find: [
    attachUsersWhoVoted(),
  ],
  get: [
    uploadHeatMap(),
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
