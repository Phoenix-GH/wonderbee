import { Alert } from 'react-native';
import _ from 'lodash';

export const MESSAGE_TITLE = 'Something went wrong';
export const MESSAGE_CONTENT =
  'We are currently experiencing technical difficulties, please try again later.';

const showMessage = (title = MESSAGE_TITLE, content = MESSAGE_CONTENT) => {
  Alert.alert(title, content);
};

const fromRequest = (error, title = MESSAGE_TITLE, content = MESSAGE_CONTENT) => {
  console.log(error);
  if (error && typeof error !== 'object') {
    return showMessage(error, content);
  }
  if (error.name === 'ConnectionError') return null;
  if (!error || !Object.keys(error).length) {
    return showMessage(title, content);
  }
  return Alert.alert(_.startCase(error.name) || title, _.startCase(error.message) || content);
};

export const AlertMessage = {
  showMessage, fromRequest
};
