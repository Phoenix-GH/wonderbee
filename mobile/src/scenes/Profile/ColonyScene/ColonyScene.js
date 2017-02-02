import React, { PropTypes } from 'react';
import { ColonyContainer } from 'AppContainers';

export function ColonyScene({ onBack, routeScene, user }) {
  return (
    <ColonyContainer
      routeBack={onBack}
      routeScene={routeScene}
      user={user}
    />
  );
}

ColonyScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  user: PropTypes.object,
};
