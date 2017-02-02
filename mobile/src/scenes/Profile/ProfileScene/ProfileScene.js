import React, { PropTypes } from 'react';
import { ProfileContainer } from 'AppContainers';

export function ProfileScene({ routeScene, onBack, userPass, activeScene }) {
  return (
    <ProfileContainer
      routeScene={routeScene}
      routeBack={onBack}
      userPass={userPass}
      activeScene={activeScene}
    />
  );
}

ProfileScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  userPass: PropTypes.object,
  activeScene: PropTypes.any,
};

ProfileScene.defaultProps = {
  userPass: null,
};
