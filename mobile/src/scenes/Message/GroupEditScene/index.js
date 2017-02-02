import React, { PropTypes } from 'react';
import { GroupEditContainer } from 'AppContainers';

export function GroupEditScene({ onBack, jumpTo, routeScene, groupId, isAdmin }) {
  return (
    <GroupEditContainer
      routeScene={routeScene}
      jumpTo={jumpTo}
      routeBack={onBack}
      groupId={groupId}
      isAdmin={isAdmin}
    />
  );
}

GroupEditScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  groupId: PropTypes.number,
  isAdmin: PropTypes.bool,
};
