import { BadRequest } from 'feathers-errors';

function match(startPattern) {
  return string => {
    const matches = string.match(new RegExp(`[${startPattern}]+[A-Za-z0-9-_]+`, 'g'));
    return matches && matches.map(value => `%${value.substr(1)}%`) || [];
  };
}

function getUsernames(string) {
  return match('@')(string);
}

function getHashtags(string) {
  return match('#')(string);
}

function getLocations(string) {
  return match('*')(string);
}

function getWords(string, begins) {
  const words = string.split(/\s+/)
    .filter(word => match('@|#|*')(word).length === 0)
    .map(word => `${begins ? '' : '%'}${word}%`);
  if (!words.length) {
    return null;
  }
  return words;
}

export default function () {
  return function parseRequest(hook) {
    const { query } = hook.data;
    if (!query || typeof query !== 'string') {
      throw new BadRequest('Invalid query', { query: 'Query should be a string' });
    }
    if (!hook.data.lookInto) {
      hook.data.lookInto = {
        users: true,
        locations: true,
        hashtags: true,
        colonies: true,
      };
    }
    hook.data = {
      lookInto: hook.data.lookInto,
      users: hook.data.lookInto.users && getUsernames(query),
      hashtags: hook.data.lookInto.hashtags && getHashtags(query),
      locations: hook.data.lookInto.locations && getLocations(query),
      groups: hook.data.lookInto.groups,
      words: getWords(query, hook.data.onlyBegins),
      $skip: hook.data.$skip || 0,
      $limit: hook.data.$limit || void(0),
    };
    hook.result = {};
    return hook;
  };
}
