import React, { PropTypes } from 'react';
import { ThreadCreateContainer } from 'AppContainers';

export const ThreadCreateScene = ({ onBack, routeScene, flagAddUser, groupUsers, groupId }) => (
  <ThreadCreateContainer
    routeBack={onBack}
    routeScene={routeScene}
    flagAddUser={flagAddUser}
    groupUsers={groupUsers}
    groupId={groupId}
  />
);

ThreadCreateScene.propTypes = {
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  flagAddUser: PropTypes.bool.isRequired,
  groupUsers: PropTypes.array,
  groupId: PropTypes.number,
};
ThreadCreateScene.defaultProps = {
  flagAddUser: false,
  groupUsers: [],
  groupId: 0,
};
