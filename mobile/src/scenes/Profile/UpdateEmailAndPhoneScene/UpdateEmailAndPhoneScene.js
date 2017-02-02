import React, { PropTypes } from 'react';
import { UpdateEmailAndPhoneContainer } from 'AppContainers';

export function UpdateEmailAndPhoneScene({ routeScene, onBack }) {
  return (
    <UpdateEmailAndPhoneContainer
      routeScene={routeScene}
      routeBack={onBack}
    />
  );
}

UpdateEmailAndPhoneScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
