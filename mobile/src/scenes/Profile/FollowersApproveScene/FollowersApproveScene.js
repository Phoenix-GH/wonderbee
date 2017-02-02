import React, { PropTypes } from 'react';
import { FollowersApproveContainer } from 'AppContainers';

export function FollowersApproveScene({ onBack, routeScene }) {
  return (
    <FollowersApproveContainer
      routeBack={onBack}
      routeScene={routeScene}
    />
  );
}

FollowersApproveScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
};
