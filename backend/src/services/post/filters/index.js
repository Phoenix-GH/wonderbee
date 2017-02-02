import onCreatedOwnUser from './onCreatedOwnUser';

export const filters = {
  created: [
    onCreatedOwnUser(),
  ],
  removed: [],
  updated: [],
  patched: [],
};
