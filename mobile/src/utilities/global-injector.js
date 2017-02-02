import invariant from 'invariant';

const has = Object.prototype.hasOwnProperty;

/**
 * Inject globals and do not override behavior if global exists by default
 *
 * @return {void}
 */
export function globalInjector() {
  return (injections) => {
    invariant(
      !!injections && typeof injections === 'object',
      'Global injections must be an object of globals to inject'
    );

    Object.keys(injections).forEach((key) => {
      const value = injections[key];
      const isMulti = Array.isArray(value);
      const hasKey = global::has(key);
      if (! isMulti && ! hasKey || isMulti && hasKey === !!value[1]) {
        global[key] = value;
      }
    });
  };
}
