import { WINDOW_WIDTH } from 'AppConstants';

export const imageContainerDims = (imageLength, layout) => {
  const containerHeight = WINDOW_WIDTH * 4 / 3;
  const containerWidth = WINDOW_WIDTH;
  switch (layout) {
    case 'quad':
      return {
        height: containerHeight / 2,
        width: containerWidth / 2,
      };
    case 'horizontal':
      return {
        height: containerHeight / imageLength,
        width: containerWidth,
      };
    case 'vertical':
    default:
      return {
        height: containerHeight,
        width: containerWidth / imageLength,
      };
  }
};
