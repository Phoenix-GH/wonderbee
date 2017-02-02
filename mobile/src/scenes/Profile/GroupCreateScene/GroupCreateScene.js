import React, { PropTypes } from 'react';
import { GroupCreateContainer } from 'AppContainers';

export function GroupCreateScene({ onBack, routeScene }) {
  return (
    <GroupCreateContainer
      routeBack={onBack}
      routeScene={routeScene}
    />
  );
}

GroupCreateScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
};
