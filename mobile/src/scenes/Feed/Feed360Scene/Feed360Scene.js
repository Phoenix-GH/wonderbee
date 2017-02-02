import React, { PropTypes } from 'react';
import { Feed360Container } from 'AppContainers';

export function Feed360Scene({ colonyName, routeScene, onBack, locations, hashtags, handles }) {
  return (
    <Feed360Container
      colonyName={colonyName}
      routeScene={routeScene}
      routeBack={onBack}
      locations={locations}
      hashtags={hashtags}
      handles={handles}
    />
  );
}

Feed360Scene.propTypes = {
  colonyName: PropTypes.string.isRequired,
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  locations: PropTypes.array,
  hashtags: PropTypes.array,
  handles: PropTypes.array,
};
