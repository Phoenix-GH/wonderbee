// TODO: REMOVE THIS STUPIDITY

export default function () {
  return function normalizeResult(hook) {
    if (hook.type === 'after' && hook.method === 'find' && Array.isArray(hook.result)) {
      hook.result = {
        total: hook.result.length,
        data: hook.result.map(res => (typeof res.toJSON === 'function' ? res.toJSON() : res)),
      };
    }
    return hook;
  };
}
