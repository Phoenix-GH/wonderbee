import React, { PropTypes } from 'react';
import { LinkedAccountsContainer } from 'AppContainers';

export function LinkedAccountsScene({ routeScene, onBack }) {
  return (
    <LinkedAccountsContainer
      routeScene={routeScene}
      routeBack={onBack}
    />
  );
}

LinkedAccountsScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
