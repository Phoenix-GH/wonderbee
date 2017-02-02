import { PushNotificationIOS, AsyncStorage } from 'react-native';
import { STORAGE_KEY_NOTIFICATIONS } from 'AppConstants';

export class PushNotification {
  static _hasPendingRequest = false;

  static addEventListener(event, cb) {
    PushNotificationIOS.addEventListener(event, (...args) => {
      PushNotification._hasPendingRequest = false;
      cb(...args);
    });
  }

  static configure(registrationCallback, notificationCallback) {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    PushNotificationIOS.addEventListener('register', (...args) => {
      PushNotification._hasPendingRequest = false;
      registrationCallback(...args);
    });
    PushNotificationIOS.addEventListener('localNotification', (notification) => {
      AsyncStorage.getItem(STORAGE_KEY_NOTIFICATIONS)
        .then(data => {
          const notificationData = {
            message: notification.getMessage(),
            data: notification.getData()
          };
          // if storage is empty, P.S. it's a first notification
          if (!data) {
            return AsyncStorage.setItem(
              STORAGE_KEY_NOTIFICATIONS,
              JSON.stringify([notificationData])
            );
          }
          const existingNotifications = JSON.parse(data);

          // Otherwise if we have 100 notification we should remove oldest notification
          if (existingNotifications.length === 100) {
            existingNotifications.shift();
          }
          existingNotifications.push(notificationData);

          return AsyncStorage.setItem(
            STORAGE_KEY_NOTIFICATIONS,
            JSON.stringify(existingNotifications)
          );
        })
        .catch(err => console.log('Error occurred', err));

      notificationCallback(notification);
    });
  }

  static removeEventListener(event, fn) {
    PushNotificationIOS.removeEventListener(event, fn);
  }

  static requestPermission(permission) {
    if (PushNotification._hasPendingRequest) {
      return null;
    }
    PushNotificationIOS.requestPermissions(permission);
    return Promise.resolve();
  }

  static abandonPermissions() {
    return PushNotificationIOS.abandonPermissions();
  }

  static checkPermissions() {
    return new Promise((resolve, reject) => {
      PushNotificationIOS.checkPermissions((permissions) => {
        const isEnabled = Object.keys(permissions).every(key => !!permissions[key]);
        if (isEnabled) {
          return resolve(isEnabled);
        }
        return reject(isEnabled);
      });
    });
  }

  static getSavedNotifications() {
    return AsyncStorage.getItem(STORAGE_KEY_NOTIFICATIONS)
      .then((data) => !!data ? JSON.parse(data) : data);
  }
}
