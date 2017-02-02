import AWS from 'aws-sdk';

const createEndpoint = (Token, PlatformApplicationArn , sns) => {
  return new Promise((resolve, reject) => {
    sns.createPlatformEndpoint({ Token, PlatformApplicationArn }, (err, data) => {
      console.log('\n\n\n\n\n', err, data, '\n\n\n\n\n\n');
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

export default function () {
  return function (hook) {
    const { deviceToken, platform } = hook.data;
    if (!deviceToken) {
      return hook;
    }
    const {
      accessKeyId,
      secretAccessKey,
      region,
      iosPlatformArn,
      androidPlatformArn,
    } = hook.app.get('aws').sns;

    const sns = new AWS.SNS({
      accessKeyId,
      secretAccessKey,
      region,
    });
    const PlatformApplicationArn = platform.toLowerCase() === 'ios' ?
      iosPlatformArn :
      androidPlatformArn;

    return createEndpoint(deviceToken, PlatformApplicationArn, sns)
      .then(data => {
        const existsArns = hook.params.user.snsTargetArns || [];
        if (existsArns.includes(data.EndpointArn)) {
          return hook;
        }
        hook.data.snsTargetArns = existsArns.concat(data.EndpointArn);
        return hook;
      })
      .catch(() => hook);
  };
}
