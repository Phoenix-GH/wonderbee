import redis from 'redis';

export default function () {
  return function setItem(hook) {
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

    // check type of key
    switch (hook.data.type) {
      case 'hash':
        hook.result = client.hset(hook.data.itemKey, hook.data.hashKey, hook.data.hashValue);
        break;
      default:
        if (hook.data.itemExpire) {
          // set the item in the cache with expiration
          hook.result = client.setex(hook.data.itemKey, hook.data.itemExpire, hook.data.itemValue);
        } else {
          // set the item in the cache with no expiration time
          hook.result = client.set(hook.data.itemKey, hook.data.itemValue);
        }
    }

    // close connection
    client.quit();

    return hook;
  };
}
