import redis from 'redis';

export default function () {
  return function getItem(hook) {
    // redis connection details for read cluster
    const { hostRead, port, password } = hook.app.get('redis');

    // redis config
    const redisConfig = {
      host: hostRead,
      port,
    };

    // if a password is set, include it in the config details
    if (password) { redisConfig.password = password; }

    // connect to redis
    const client = redis.createClient(redisConfig);

    // get my query parameters
    const query = hook.params.query;
    let switchPromise = () => null;

    // check type of key
    switch (query.type) {
      case 'hash':
        switchPromise = () => new Promise(resolve => {
          client.hget(query.itemKey, query.hashKey, (err, result) => {
            resolve(result);
          });
        });
        break;
      default:
        switchPromise = () => new Promise(resolve => {
          client.get(query.itemKey, (err, result) => {
            resolve(result);
          });
        });
    }

    return switchPromise()
    .then(result => {
      hook.result = result;
      // close connection
      client.quit();
      return hook;
    })
    .catch(error => console.log(error));
  };
}
