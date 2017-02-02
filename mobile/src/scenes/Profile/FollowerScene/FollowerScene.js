import React, { PropTypes } from 'react';
import { FollowerContainer } from 'AppContainers';

export function FollowerScene({ onBack, followers, userId, routeScene }) {
  return (
    <FollowerContainer
      routeBack={onBack}
      userId={userId}
      followers={followers}
      routeScene={routeScene}
    />
  );
}

FollowerScene.propTypes = {
  followers: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
};
