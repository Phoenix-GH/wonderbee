import React, { PropTypes } from 'react';
import { ListUserVoteContainer } from 'AppContainers';

export function ListUserVoteScene({ routeScene, onBack, postId, imageIds, voting, multiImage }) {
  return (
    <ListUserVoteContainer
      routeBack={onBack}
      routeScene={routeScene}
      postId={postId}
      imageIds={imageIds}
      voting={voting}
      multiImage={multiImage}
    />
  );
}

ListUserVoteScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  imageIds: PropTypes.array.isRequired,
  voting: PropTypes.bool.isRequired,
  multiImage: PropTypes.bool.isRequired,
};
