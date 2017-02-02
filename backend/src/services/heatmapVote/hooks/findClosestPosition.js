import { BadRequest } from 'feathers-errors';
import Heatmap from '../Heatmap';

export default function (pointRadius) {
  return function findClosestPosition(hook) {
    const {
      position,
      imageDimensions: { width: imageWidth, height: imageHeight },
      screenDimensions: { width: screenWidth, height: screenHeight },
    } = hook.data;
    if (!position || !position.x || !position.y) {
      throw new BadRequest('Invalid position', {
        position: 'position should be an object with x and y',
      });
    }
    const translateX = imageWidth / screenWidth * position.x;
    const translateY = imageHeight / screenHeight * position.y;
    const heatmap = new Heatmap(imageWidth, pointRadius, imageWidth / imageHeight);
    const { x, y } = heatmap.findClosestPosition(
      Number(translateX),
      Number(translateY)
    );
    hook.data.position.x = x;
    hook.data.position.y = y;
  };
}
