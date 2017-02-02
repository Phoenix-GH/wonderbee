import React, { PropTypes } from 'react';
import { ChangePasswordContainer } from 'AppContainers';

export function ChangePasswordScene({ routeScene, onBack }) {
  return (
    <ChangePasswordContainer
      routeScene={routeScene}
      routeBack={onBack}
    />
  );
}

ChangePasswordScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
