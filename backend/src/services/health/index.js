import memory from 'feathers-memory';

export default function init() {
  const app = this;
  app.use('/health', memory());
  app.service('health').before({
    find(hook) {
      // if error - throw a 503 error
      hook.result = hook.app.get('version');
      return hook;
    },
  });
}
