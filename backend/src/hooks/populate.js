import hooks from 'feathers-hooks';

export default function (field, options) {
  const myPopulate = hooks.populate(field, options);
  return function populate(hook) {
    if (hook.params.provider || !!hook.params.populate) {
      return myPopulate(hook);
    }
    return hook;
  };
}
