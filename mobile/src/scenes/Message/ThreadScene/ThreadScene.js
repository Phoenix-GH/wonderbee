import React, { PropTypes } from 'react';
import { ThreadContainer } from 'AppContainers';


export function ThreadScene({ routeScene, onBack }) {
  return (
    <ThreadContainer
      routeScene={routeScene}
      routeBack={onBack}
    />
  );
}

ThreadScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
