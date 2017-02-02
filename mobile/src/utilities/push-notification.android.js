import PushNotificationAndroid from 'react-native-push-notification';
import { GCM_PROJECT_NUMBER } from 'AppConfig';
import { AsyncStorage } from 'react-native';
import { STORAGE_KEY_NOTIFICATIONS } from 'AppConstants';

export class PushNotification {
  static _hasPendingRequest = false;
  static addEventListener(evt, registrationCallback, notificationCallback) {
    return Promise.resolve();
  }
  static configure(registrationCallback, notificationCallback) {
    PushNotificationAndroid.configure({
      onRegister(token) {
        PushNotification._hasPendingRequest = false;
        registrationCallback(token.token);
      },
      onNotification(notification) {
        notificationCallback(notification);
      },
      senderID: GCM_PROJECT_NUMBER,
      requestPermissions: false,
    });
  }
  static removeEventListener() {
    return Promise.resolve();
  }
  static requestPermission(senderID = GCM_PROJECT_NUMBER) {
    if (PushNotification._hasPendingRequest) {
      return Promise.reject('App have a pending request');
    }
    PushNotification._hasPendingRequest = true;
    PushNotificationAndroid.requestPermissions(senderID);
    return Promise.resolve();
  }
  static abandonPermissions() {
    PushNotificationAndroid.unregister();
    return Promise.resolve();
  }
  static checkPermissions() {
    /**
     * @description
     * If you want to re-request for permission on every time
     * you can just return Promise.reject()
     * */
    return Promise.resolve();
  }
  static getSavedNotifications() {
    return AsyncStorage.getItem(STORAGE_KEY_NOTIFICATIONS)
      .then((data) => !!data ? JSON.parse(data) : data);
  }
}
