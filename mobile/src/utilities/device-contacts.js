import Contacts from 'react-native-contacts';
import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const UnifiedContacts = NativeModules.RNUnifiedContacts;
const isIPhone = Platform.OS === 'ios';

const iOSVersion = isIPhone ?
  DeviceInfo.getSystemVersion() :
  null;

const isUnifiedContactsSupported = iOSVersion && parseInt(iOSVersion, 10) >= 9;

export const PERMISSION_AUTHORIZED = Contacts.PERMISSION_AUTHORIZED;
export const PERMISSION_DENIED = Contacts.PERMISSION_DENIED;
export const PERMISSION_UNDEFINED = Contacts.PERMISSION_UNDEFINED;

const getUnifiedContacts = () => (
  new Promise((resolve, reject) => (
    UnifiedContacts.getContacts((err, contacts) => (
      err ? reject(err) : resolve(contacts)
    ))
  ))
);

const checkUnifiedContactsPermission = () => (
  new Promise((resolve, reject) => (
    UnifiedContacts.userCanAccessContacts((canAccess) => (
      canAccess ? resolve(canAccess) : reject(canAccess)
    ))
  ))
);

const requestGetUnifiedContactsPermission = () => (
  new Promise((resolve, reject) => (
    UnifiedContacts.requestAccessToContacts((granted) => (
      granted ? resolve(granted) : reject(granted)
    ))
  ))
);

export const getContacts = () => {
  if (isUnifiedContactsSupported) {
    return getUnifiedContacts();
  }
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        return reject(err);
      }
      return resolve(contacts);
    });
  });
};

export const checkGetContactsPermission = () => {
  if (isUnifiedContactsSupported) {
    return checkUnifiedContactsPermission();
  }
  return new Promise((resolve, reject) => {
    Contacts.checkPermission((err, permission) => {
      if (err) {
        return reject(err);
      }
      return resolve(permission);
    });
  });
};

export const requestGetContactsPermission = () => {
  if (isUnifiedContactsSupported) {
    return requestGetUnifiedContactsPermission();
  }
  return new Promise((resolve, reject) => {
    Contacts.requestPermission((err, permission) => {
      if (err) {
        return reject(err);
      }
      return resolve(permission);
    });
  });
};
