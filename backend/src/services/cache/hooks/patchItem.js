import redis from 'redis';

export default function () {
  return function patchItem(hook) {
    // redis connection details for read cluster
    const { hostWrite, port, password } = hook.app.get('redis');

    // redis config
    const redisConfig = {
      host: hostWrite,
      port,
    };

    // if a password is set, include it in the config details
    if (password) { redisConfig.password = password; }

    // connect to redis
    const client = redis.createClient(redisConfig);

    // get type of action being done on the key
    switch (hook.data.itemAction) {
      case 'incr':
        hook.result = client.incr(hook.data.itemKey);
        break;
      case 'decr':
        hook.result = client.decr(hook.data.itemKey);
        break;
      default:
        // do nothing
    }

    // close connection
    client.quit();

    return hook;
  };
}
