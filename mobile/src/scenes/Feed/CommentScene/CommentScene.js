import React, { PropTypes } from 'react';
import { CommentContainer } from 'AppContainers';

export function CommentScene({ routeScene, onBack, post, isModal, currentImage }) {
  return (
    <CommentContainer
      routeScene={routeScene}
      routeBack={onBack}
      post={post}
      isModal={isModal}
      currentImage={isModal ? currentImage : null}
    />
  );
}

CommentScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  isModal: PropTypes.bool.isRequired,
  currentImage: PropTypes.object
};
