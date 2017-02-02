import React, { PropTypes } from 'react';
import { ProfileEditContainer } from 'AppContainers';

export function ProfileEditScene({ onBack, routeScene }) {
  return (
    <ProfileEditContainer
      routeScene={routeScene}
      routeBack={onBack}
    />
  );
}

ProfileEditScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
