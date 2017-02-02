import React, { PropTypes } from 'react';
import { AvatarCameraContainer } from 'AppContainers';

export function AvatarCameraScene({ routeScene, onBack, onAvatarSave }) {
  return (
    <AvatarCameraContainer
      routeBack={onBack}
      routeScene={routeScene}
      onAvatarSave={onAvatarSave}
    />
  );
}

AvatarCameraScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  onAvatarSave: PropTypes.func,
};
