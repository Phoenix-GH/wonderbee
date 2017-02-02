/**
 * @providesModule AppUtilities
 */

export { makeCancelable } from './make-cancelable';
export { parseJpeg } from './parse-jpeg';
export { dismissKeyboard } from './dismiss-keyboard';
export { globalInjector } from './global-injector';
// export { imageToDataUri } from './image-to-data-uri';
export { shallowEqual } from './shallow-equal';
export { ResponderPressable } from './responder-pressable';
export { toggle } from './toggle';
export { AlertMessage } from './alert-message';
export { getHexagonLayout, renderHexagonImages, renderHexagonIcons } from './hexagon-util';
export {
  PERMISSION_AUTHORIZED,
  PERMISSION_DENIED,
  PERMISSION_UNDEFINED,
  getContacts,
  checkGetContactsPermission,
  requestGetContactsPermission
} from './device-contacts';
export { createTempDirectory, removeTempDirectory, readBase64File } from './file-util';
export { noopFunction, emptyFunction } from './noop-function';
export { Storage } from './storage';
export { PushNotification } from './push-notification';
export { resizeImage } from './resize-image';
