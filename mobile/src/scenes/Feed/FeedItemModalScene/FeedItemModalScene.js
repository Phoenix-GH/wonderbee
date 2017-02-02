import React, { PropTypes } from 'react';
import { FeedMultiImagesModal } from 'AppComponents';

export function FeedItemModalScene({
  images,
  onBack,
  votedImage,
  voteImageCount,
  pageIndex,
}) {
  return (
    <FeedMultiImagesModal
      images={images}
      votedImage={votedImage}
      voteImageCount={voteImageCount}
      pageIndex={pageIndex}
      routeBack={onBack}
    />
  );
}

FeedItemModalScene.propTypes = {
  images: PropTypes.array.isRequired,
  votedImage: PropTypes.bool.isRequired,
  voteImageCount: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};
