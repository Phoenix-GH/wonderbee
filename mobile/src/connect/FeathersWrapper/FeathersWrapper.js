import React, {
  Children,
  PropTypes,
  Component,
} from 'react';
import { AsyncStorage, View } from 'react-native';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication/client';
import io from './utils/socket-io';
import contextShape from './utils/contextShape';
import { PushNotificationIOS } from 'react-native';
import { TopBanner } from './TopBanner';
import * as services from 'AppServices';
import { ConnectionError } from 'AppConstants';

export class FeathersWrapper extends Component {
  static propTypes = {
    children: PropTypes.any,
    wsEndpoint: PropTypes.string,
    loader: PropTypes.any,
    timeout: PropTypes.number
  };

  static defaultProps = {
    wsEndpoint: 'http://127.0.0.1:3030',
    reconnection: true,
    loader: null,
    timeout: null,
  };

  static childContextTypes = {
    feathers: contextShape
  };

  constructor(props, context) {
    super(props, context);
    const options = {
      transports: ['websocket'],
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 300,
      reconnectionDelayMax: 3000
    };
    const socket = io(props.wsEndpoint, options);
    this._initialized = false;
    this._connected = false;
    this._showMessage = false;
    this._showBanner = false;
    this.pushNotification = { message: '' };
    this._addTimeout = ::this._addTimeout;
    this._clearTimeout = ::this._clearTimeout;
    this.handlePushNotification = ::this.handlePushNotification;
    this.app = feathers()
    .configure(socketio(socket, { timeout: props.timeout }))
    .configure(hooks())
    .configure(authentication({
      storage: AsyncStorage
    }));

    const self = this;
    for (const service of Object.values(services)) {
      this.app.service(service).before({
        all: [
          function checkConnection(hook) {
            if (!self._connected) {
              if (!self._showMessage) {
                self._showMessage = true;
                self.forceUpdate();
                self._showMessage = false;
              }
              throw new ConnectionError('Connection lost!');
            }

            return hook;
          }
        ]
      });
    }
  }

  getChildContext() {
    return { feathers: this.app };
  }

  componentDidMount() {
    if (this.props.timeout) {
      this._addTimeout(this.props.timeout);
    }

    this.app.io.on('connect', () => {
      this._initialized = true;
      this._showMessage = false;
      this._clearTimeout();
      this.forceUpdate();
      this.app.authenticate()
        .finally(() => {
          this._connected = true;
        });
    });
    this.app.io.on('disconnect', () => {
      this._connected = false;
    });
    PushNotificationIOS.addEventListener('notification', this.handlePushNotification);
    PushNotificationIOS.addEventListener('localNotification', this.handlePushNotification);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this._clearTimeout();
    PushNotificationIOS.removeEventListener('notification', this.handlePushNotification);
    PushNotificationIOS.removeEventListener('localNotification', this.handlePushNotification);
  }

  handlePushNotification(notification) {
    this.pushNotification = {
      message: notification.getMessage(),
      userInfo: notification.getData()
    };
    this._showBanner = true;
    this.forceUpdate();
    this._showBanner = false;
  }

  _addTimeout(ms) {
    if (ms > 0) {
      this._timeout = setTimeout(() => {
        this._initialized = true;
        delete this._timeout;
        this.forceUpdate();
      }, ms);
    }
  }

  _clearTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      delete this._timeout;
    }
  }

  render() {
    const {
      children,
      loader
    } = this.props;

    if (! this._initialized) {
      return loader;
    }

    return (<View style={{ flex: 1 }}>
        {Children.only(children)}
        <TopBanner
          defaultTitle={'JustHive'}
          message={this.pushNotification.message}
          showBanner={this._showBanner}
          userInfo={this.pushNotification.userInfo}
          connectionLost={this._showMessage}
          connectionLostMessage={'Connection lost!'}
        />
      </View>
    );
  }
}
