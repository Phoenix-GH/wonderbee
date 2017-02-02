import AWS from 'aws-sdk';

function sendSMS(sns, snsData) {
  const { recipient, message } = snsData.data;
  const options = {
    Message: message,
  };

  if (recipient) {
    options.PhoneNumber = recipient;
  } else {
    options.PhoneNumber = snsData.userDetails.phone;
  }

  sns.publish(options, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      // eslint-disable-next-line max-len, no-console
      console.log(`Notification SMS (${options.PhoneNumber}) - RequestId: ${data.ResponseMetadata.RequestId}  MessageId: ${data.MessageId}  Message: ${snsData.Message}`);
    }
  });
}

function sendPush(sns, snsData) {
  const { userDetails } = snsData;
  const { message, recipient } = snsData.data;
  const payload = {
    default: message,
    APNS: {
      aps: {
        alert: message,
        userInfo: userDetails,
      },
    },
    GCM: {
      data: {
        title: message,
        alert: message,
        userInfo: userDetails,
      },
    },
  };
  // from https://gist.github.com/tmarshall/6149ed2475f964cda3f5
  payload.APNS = JSON.stringify(payload.APNS);
  payload.GCM = JSON.stringify(payload.GCM);

  const options = {
    Message: JSON.stringify(payload),
    MessageStructure: 'json',
  };

  if (recipient) {
    options.TargetArn = recipient;
    return sns.publish(options, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err, err.stack);
      }
    });
  }
  if (!userDetails.snsTargetArns) {
    return null;
  }
  return userDetails.snsTargetArns.forEach((TargetArn) => {
    options.TargetArn = TargetArn;

    sns.publish(options, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Push:error: ', err, err.stack);
      }
    });
  });
}

function sendEmail(ses, sesData, sesConfig) {
  const { subject, message, recipient } = sesData.data;
  const options = {
    Destination: {
      ToAddresses: [],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: sesConfig.sourceAddress,
  };

  if (recipient) {
    options.Destination.ToAddresses = [recipient];
  } else {
    options.Destination.ToAddresses = [sesData.userDetails.email];
  }

  ses.sendEmail(options, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      // eslint-disable-next-line max-len, no-console
      console.log(`Notification Email (${options.Destination.ToAddresses}) - RequestId: ${data.ResponseMetadata.RequestId}  MessageId: ${data.MessageId}  Subject: ${options.Message.Subject.Data}  Message: ${options.Message.Body.Text.Data}`);
    }
  });
}

function checkNotificationAllowed(hook) {
  const { userId } = hook.data;
  const { type } = hook.data.data;
  return hook.app.service('users').get(userId)
    .then((userDetails) => (
      userDetails.notificationSettings.hasOwnProperty(type) && (
        userDetails.notificationSettings[type] === true && userDetails
      )
    ))
    .catch(error => console.log(error));
  // return hook.app.service('cache').get(null, {
  //   query: {
  //     type: 'hash',
  //     itemKey: `users:${hook.data.userId}`,
  //     hashKey: 'userDetails',
  //   },
  // })
  // .then((userDetails) => {
  //   const { pushType } = hook.data;
  //   const user = JSON.parse(userDetails);
  //   return user.notificationSettings.hasOwnProperty(pushType) && (
  //       user.notificationSettings[pushType]
  //     ) && user;
  // })
  // .catch(() =>
  //   hook.app.service('users').get(hook.data.userId)
  //   .then(userDetails => {
  //     hook.app.service('cache').create({
  //       type: 'hash',
  //       itemKey: `users:${hook.data.userId}`,
  //       hashKey: 'userDetails',
  //       hashValue: JSON.stringify(userDetails),
  //     });
  //     const { pushType } = hook.data;
  //     return userDetails.notificationSettings.hasOwnProperty(pushType) && (
  //       userDetails.notificationSettings[pushType] === true && userDetails
  //     );
  //   })
  //   .catch(error => console.log(error))
  // );
}

export default function () {
  return function (hook) {
    const { type } = hook.data;
    switch (type) {
      case 'sms': {
        const { accessKeyId, secretAccessKey, region } = hook.app.get('aws').sns;
        const sns = new AWS.SNS({
          accessKeyId,
          secretAccessKey,
          region,
        });

        return sendSMS(sns, hook.data, hook.app.get('aws').sns);
      }
      case 'email': {
        const { accessKeyId, secretAccessKey, region } = hook.app.get('aws').ses;
        const ses = new AWS.SES({
          accessKeyId,
          secretAccessKey,
          region,
        });

        return sendEmail(ses, hook.data, hook.app.get('aws').ses);
      }
      default: {
        return checkNotificationAllowed(hook)
        .then((result) => {
          if (!result) {
            return hook;
          }
          const { accessKeyId, secretAccessKey, region } = hook.app.get('aws').sns;
          const sns = new AWS.SNS({
            accessKeyId,
            secretAccessKey,
            region,
          });
          const passResult = Object.assign({}, hook.data, {
            userDetails: result,
          });

          return sendPush(sns, passResult, hook.app.get('aws').sns);
        });
      }
    }
  };
}
