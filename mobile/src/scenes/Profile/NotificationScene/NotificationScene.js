import React, { Component, PropTypes } from 'react';
import { NotificationContainer } from 'AppContainers';

export default class NotificationScene extends Component {
  static propTypes = {
    routeScene: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.routeTarget = ::this.routeTarget;
  }

  routeTarget(notification, prop) {
    switch (notification.from) {
      case 'message':
        break;
      case 'follower':
        break;
      default:
        return null;
    }
  }

  render() {
    const { onBack } = this.props;
    return (
      <NotificationContainer
        routeBack={onBack}
        routeTarget={this.routeTarget}
      />
    );
  }
}
