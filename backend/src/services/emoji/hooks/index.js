import { disable, removeQuery } from 'feathers-hooks';
import auth from 'feathers-authentication';
import { convertToJSON } from '../../../hooks';
import getUrl from './getUrl';
import groupByPresets from './groupByPresets';
import groupByRows from './groupByRows';
import groupByCategories from './groupByCategories';

const presets = {
  general: [28, 102, 86, 150, 134],
  rating: [1296, 1297, 1298, 1299, 1300],
  yesno: [28, 29],
};
const allPresets = presets.general.concat(presets.rating).concat(presets.yesno);

export const before = {
  all: [
    auth.hooks.verifyToken(),
  ],
  find: [
    removeQuery('requestType', (hook) => {
      const { requestType } = hook.params.query;
      if (requestType === 'presets') {
        hook.params.query = Object.assign({}, { id: { $in: allPresets } });
        hook._query = { presets: true };
      }
      if (requestType === 'all') {
        hook._query = { all: true };
      }
      return true;
    }),
  ],
  get: [],
  create: [],
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
    getUrl(),
    groupByPresets(presets),
    groupByCategories(),
    groupByRows(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
