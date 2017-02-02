import React, { PropTypes } from 'react';
import { GroupContainer } from 'AppContainers';

export function GroupScene({ onBack, routeScene }) {
  return (
    <GroupContainer
      routeBack={onBack}
      routeScene={routeScene}
    />
  );
}

GroupScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
};
