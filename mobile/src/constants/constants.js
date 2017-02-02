import { Dimensions, LayoutAnimation } from 'react-native';
import Camera from 'react-native-camera';
import { isEmail, isMobilePhone } from 'validator';

const { width, height } = Dimensions.get('window');

export const NO_PAN_HANDLERS_SCENES = [
  'FeedScene', 'ProfileScene',
  'SearchScene', 'ThreadScene',
  'CameraScene', 'TopicsScene',
  'PhotoEditScene',
  'VideoEditScene',
];

export const NO_BACK_ANDROID = [
  'FeedScene', 'ProfileScene',
  'SearchScene', 'ThreadScene',
  'TopicsScene',
];

export const NO_TRANSITION_SCENES = [
  'FeedScene',
  'ProfileScene',
  'HiveHomeScene',
  'ThreadScene',
];

export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
export const STATUSBAR_HEIGHT = 20;
export const NAVBAR_HEIGHT = 70;
export const CAPTURE_VIDEO = Camera.constants.CaptureMode.video;
export const CAPTURE_PICTURE = Camera.constants.CaptureMode.still;
export const CAMERA_ROLL_PHOTOS = "Photos";
export const CAMERA_ROLL_VIDEOS = "Videos";

export const CLICK_DURATION = 300;
export const THUMB_SIZE = 70;

export const HEXAGON_SIZE = 82;
export const HEXAGON_IMAGE_SIZE = 2 * HEXAGON_SIZE / Math.sqrt(3);
export const HEXAGON_PADDING = 10;
export const HEATMAP_HEXAGON_X_COUNT = 15;
export const HEXAGON_AVATARS = [
  'https://s3.amazonaws.com/uifaces/faces/twitter/chris_witko/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/sergeyalmone/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/richardgarretts/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/lhausermann/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/baluli/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/chrisslowik/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/malgordon/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/nsamoylov/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/brandonmorreale/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/bruno_mart/128.jpg',
];
export const HEXAGON_LOGO = require('img/icons/icon_logo.png');
export const LAYOUT_ANIMATION_CONFIG = {
  duration: 1000,
  create: {
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity
  }
};

export const SOCIAL_ITEMS = [
  {
    name: 'Email',
    icon: require('img/icons/icon_email.png'),
    style: {
      width: 23,
      height: 17
    }
  },
  {
    name: 'Text',
    icon: require('img/icons/icon_text.png'),
    style: {
      width: 23,
      height: 21
    }
  },
  {
    name: 'Facebook',
    icon: require('img/icons/icon_facebook.png'),
    style: {
      width: 12,
      height: 23
    }
  },
  {
    name: 'Twitter',
    icon: require('img/icons/icon_twitter.png'),
    style: {
      width: 23,
      height: 20
    }
  },
  {
    name: 'Pinterest',
    icon: require('img/icons/icon_pinterest.png'),
    style: {
      width: 23,
      height: 25
    }
  }
];

export const REC_ANIMATION_TIMER = 'RecordButtonAnimationTimer';
export const REC_ANIMATION_DELAY_TIME = 100; // milisecond
export const REC_ANIMATION_LIMIT_TIME = 15; // second
export const REC_PATH_AMOUNT = 6; // border amount of polygon
export const REC_BUTTON_FRAME = [{ x: 50, y: 12 }, { x: 70, y: 12 }, { x: 89, y: 48 }, { x: 69, y: 85 }, { x: 28, y: 85 }, { x: 7, y: 48 }, { x: 28, y: 12 }, { x: 50, y: 12 }]; // record button frame

export const SEARCH_DELAY_TIME = 1500;
export const SEARCH_FILTERS = {
  COLONIES: 'Colonies',
  PEOPLE: 'People',
  PLACES: 'Places',
  HASHTAGS: 'Hashtags',
};
export const VALIDATIONS = {
  required: (message = 'Required') => value => !value && message,
  email: (message = 'Invalid email') => value => value && !isEmail(value) && message,
  phone: (locale = 'en-US', message = 'Invalid phone') =>
    value => value && !isMobilePhone(value, locale) && message,
};
export const JUST_HIVE_HOST = 'https://www.justhive.com';

export const API = {
  POSTS: {
    ID: (id) => `${JUST_HIVE_HOST}/p/${id}`,
  }
};
export const REGEXPS = {
  USERNAME: /@\w+/,
  HASH_TAG: /#\w+/,
};
export const FEED_USER_INFO_OVERLAY_WIDTH = width * 6 / 7;
export const FEED_USER_INFO_OVERLAY_HEIGHT = 240;
export const FEED_ITEM = {
  HEIGHT: WINDOW_WIDTH * 4 / 3,
  WIDTH: WINDOW_WIDTH
};

export const LOCAL_CODES = [
  '+1', '+374', '+7'
];
export const STORAGE_KEY_NOTIFICATIONS = '@notifications';
