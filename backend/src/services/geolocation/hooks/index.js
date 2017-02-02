import converToLocation from './converToLocation';
import flattenResult from './flattenResult';

export const before = {
  all: [],
  find: [
    converToLocation(),
  ],
  get: [],
};
export const after = {
  all: [],
  find: [
    flattenResult(),
  ],
  get: [],
};
