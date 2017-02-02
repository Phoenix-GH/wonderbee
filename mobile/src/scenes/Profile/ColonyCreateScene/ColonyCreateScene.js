import React, { PropTypes } from 'react';
import { ColonyCreateContainer } from 'AppContainers';

export function ColonyCreateScene({ onBack, routeScene, copy }) {
  return (
    <ColonyCreateContainer
      routeBack={onBack}
      routeScene={routeScene}
      copy={copy}
    />
  );
}

ColonyCreateScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  copy: PropTypes.object,
};
