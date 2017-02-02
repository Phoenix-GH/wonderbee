import React, { PropTypes } from 'react';
import { CommentContainer } from 'AppContainers';

export function NestedCommentScene({ comment, onBack, routeScene, isModal, post }) {
  return (
    <CommentContainer
      comment={comment}
      routeBack={onBack}
      routeScene={routeScene}
      isModal={isModal}
      post={post}
    />
  );
}

NestedCommentScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  isModal: PropTypes.bool.isRequired
};
