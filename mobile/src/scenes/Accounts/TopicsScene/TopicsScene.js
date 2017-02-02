import React, { Component, PropTypes } from 'react';
import { TopicsContainer } from 'AppContainers';

export class TopicsScene extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    signup: PropTypes.bool,
  };

  static defaultProps = {
    signup: false,
  };

  constructor(props, context) {
    super(props, context);
    this.toFindFriendsScene = ::this.toFindFriendsScene;
  }
  toFindFriendsScene() {
    const { routeScene, signup } = this.props;
    return routeScene('FindFriendsMethodScene', { signup });
  }
  render() {
    const { onBack, signup } = this.props;
    return (
      <TopicsContainer
        onBack={onBack}
        next={this.toFindFriendsScene}
        signup={signup}
      />
    );
  }
}
