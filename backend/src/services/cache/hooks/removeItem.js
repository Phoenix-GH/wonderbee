import redis from 'redis';

export default function () {
  return function removeItem(hook) {
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

    // get my query parameters
    const query = hook.params.query;

    // fetch item from the cache
    hook.result = client.del(query.itemKey);

    // close connection
    client.quit();

    return hook;
  };
}
