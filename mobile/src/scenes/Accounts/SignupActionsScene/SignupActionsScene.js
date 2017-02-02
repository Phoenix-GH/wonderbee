import React, { Component, PropTypes } from 'react';
import { SignupActionsContainer } from 'AppContainers';

export class SignupActionsScene extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    resetRouteStack: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.navigateToSignupMethod = ::this.navigateToSignupMethod;
    this.navigateToSignup = ::this.navigateToSignup;
  }
  navigateToSignupMethod() {
    const { routeScene } = this.props;
    return routeScene('SignupMethodScene');
  }
  navigateToSignup(facebook) {
    const { routeScene } = this.props;
    return routeScene('SignupScene', { facebook });
  }
  render() {
    const { onBack } = this.props;
    return (
      <SignupActionsContainer
        routeBack={onBack}
        navigateToSignupMethod={this.navigateToSignupMethod}
        navigateToSignup={this.navigateToSignup}
      />
    );
  }
}
