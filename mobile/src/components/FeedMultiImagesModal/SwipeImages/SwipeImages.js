import React, { PropTypes } from 'react';
import Swiper from 'react-native-swiper';
import _ from 'lodash';
import { FullImageView } from './FullImageView';

export function SwipeImages({ images, pageIndex, onSwipe, tagsActive, activateTags, routeBack }) {
  const swipeViews = _.map(images,
    (image, index) =>
      <FullImageView
        key={index}
        image={image}
        tagsActive={tagsActive}
        activateTags={activateTags}
        routeBack={routeBack}
      />
  );
  return (
    <Swiper
      showsPagination={false}
      index={pageIndex}
      onMomentumScrollEnd={(e, state) => onSwipe(images[state.index])}
    >
      {swipeViews}
    </Swiper>
  );
}

SwipeImages.propTypes = {
  tagsActive: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onSwipe: PropTypes.func.isRequired,
  activateTags: PropTypes.func.isRequired,
  routeBack: PropTypes.func.isRequired,
};
