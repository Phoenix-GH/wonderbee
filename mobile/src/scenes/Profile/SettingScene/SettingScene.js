import React, { PropTypes } from 'react';
import { SettingContainer } from 'AppContainers';

export function SettingScene({ routeScene, onBack, resetRouteStack }) {
  return (
    <SettingContainer
      routeBack={onBack}
      routeScene={routeScene}
      resetRouteStack={resetRouteStack}
    />
  );
}

SettingScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  resetRouteStack: PropTypes.func.isRequired,
};
