import React, { Component, PropTypes } from 'react';
import { ListView, View } from 'react-native';
import { SimpleTopNav, Notification } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { NOTIFICATION_SERVICE, GROUP_SERVICE, USER_SERVICE } from 'AppServices';
import { AlertMessage } from 'AppUtilities';
import { BLUE } from 'AppColors';
import { styles } from './styles';

class NotificationContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeTarget: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      notifications: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      initialRender: false,
    };
    this.renderRow = ::this.renderRow;
    this.getNotifications = ::this.getNotifications;
    this.handlePress = ::this.handlePress;
  }

  componentWillMount() {
    this.getNotifications();
  }

  getNotifications() {
    const { feathers } = this.props;
    const notificationService = feathers.service(NOTIFICATION_SERVICE);
    const query = { $sort: { updatedAt: -1 } };
    notificationService.find({ query })
      .then(notifications => this.setState({
        notifications: this.state.notifications.cloneWithRows(notifications),
        initialRender: true,
      }))
      .catch(error => AlertMessage.fromRequest(error));
  }

  handlePress(notification) {
    const { feathers, routeTarget } = this.props;
    const groupService = feathers.service(GROUP_SERVICE);
    const userService = feathers.service(USER_SERVICE);
    switch (notification.from) {
      case 'message': {
        return groupService.get(notification.targetId)
          .then(thread => routeTarget(notification, thread.involved))
          .catch(error => AlertMessage.fromRequest(error));
      }
      case 'follower': {
        return userService.get(notification.targetId)
          .then(user => routeTarget(notification, user))
          .catch(error => AlertMessage.fromRequest(error));
      }
      default: {
        return null;
      }
    }
  }

  renderRow(notification) {
    return (
      <Notification
        content={notification.content}
        handlePress={() => this.handlePress(notification)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SimpleTopNav
          leftAction={this.props.routeBack}
          centerLabel="NOTIFICATIONS"
        />
        {this.state.initialRender ?
          <ListView
            dataSource={this.state.notifications}
            renderRow={this.renderRow}
          />
        : null}
      </View>
    );
  }
}

export default connectFeathers(NotificationContainer);
