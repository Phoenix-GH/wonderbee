import React, { Component, PropTypes } from 'react';
import {
  View,
  InteractionManager,
} from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { NotificationList } from 'AppComponents';
import { NOTIFICATION_SERVICE, GROUP_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage, PushNotification } from 'AppUtilities';

class NotificationContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    selectMode: PropTypes.bool.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      notifications: [],
      limit: 10,
      loading: true,
      selectMode: props.selectMode,
      refreshing: false
    };
    this.getNotifications = ::this.getNotifications;
    this.updateRead = ::this.updateRead;
    this.onRefresh = ::this.onRefresh;
    this.getNotificationPromise = null;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getNotifications();
    });
  }

  componentWillUnmount() {
    if (this.getNotificationPromise) {
      this.getNotificationPromise.cancel();
    }
  }

  onRefresh() {
    this.setState({ refreshing: true, limit: 10 }, () => this.getNotifications());
  }

  getNotifications() {
    return PushNotification.getSavedNotifications()
      .then((notifications = []) => this.setState({ notifications }))
      .catch(err => AlertMessage.fromRequest(err));
  }

  gotoThread(id) {
    const { feathers } = this.props;
    const groupService = feathers.service(GROUP_SERVICE);
    const userId = this.props.feathers.get('user').id;
    const query = { targetId: id, userId };
    feathers.service(NOTIFICATION_SERVICE).patch(null, { read: true }, { query } )
      .catch(error => AlertMessage.fromRequest(error));

    this.getThreadPromise = makeCancelable(groupService.find({ query: { id } }));
    this.getThreadPromise
      .promise
      .then(threads => {
        this.props.routeScene('MessageScene', { thread: threads.data[0] });
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
      });
  }

  updateRead(notification) {
    const { targetId, type } = notification;
    if (type === 'message') {
      this.gotoThread(targetId);
    }
  }

  render() {
    const { notifications, refreshing } = this.state;
    if (notifications && notifications.length > 0) {
      return (
        <NotificationList
          notifications={notifications}
          selectMode={this.props.selectMode}
          getMoreNotifications={this.getMoreNotifications}
          updateRead={this.updateRead}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        />
      );
    }
    return <View />;
  }

}

export default connectFeathers(NotificationContainer, { withRef: true });
