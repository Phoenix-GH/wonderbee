import React, { PropTypes } from 'react';
import { PushNotificationOptionsContainer } from 'AppContainers';

export const PushNotificationOptionsScene = ({
  onBack,
  routeScene
}) => (
  <PushNotificationOptionsContainer
    onBack={onBack}
    routeScene={routeScene}
  />
);

PushNotificationOptionsScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired
};
