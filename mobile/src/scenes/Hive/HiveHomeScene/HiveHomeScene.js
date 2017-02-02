import React, { PropTypes } from 'react';
import { HiveHomeContainer } from 'AppContainers';


export function HiveHomeScene({ routeScene }) {
  return (
    <HiveHomeContainer
      routeScene={routeScene}
    />
  );
}

HiveHomeScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
};
