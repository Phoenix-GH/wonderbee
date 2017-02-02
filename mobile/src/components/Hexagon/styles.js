import { Platform } from 'react-native';

function getHexagonHeight(rectangleWidth, hexagonSize) {
  return rectangleWidth + (hexagonSize / Math.sqrt(3));
}

function getRectangleWidth(hexagonSize) {
  const a = Math.pow(hexagonSize / Math.sqrt(3), 2);
  const b = Math.pow(hexagonSize / 2, 2);
  return Math.sqrt(a - b) * 2;
}

export function getDimensions(hexagon) {
  const rectangleWidth = getRectangleWidth(hexagon.size);
  const rectangleHeight = hexagon.size;
  const hexagonWidth = hexagon.isHorizontal ?
    getHexagonHeight(rectangleWidth, hexagon.size) :
    hexagon.size;
  const hexagonHeight = hexagon.isHorizontal ?
    hexagon.size :
    getHexagonHeight(rectangleWidth, hexagon.size);
  const rectangleTop = (hexagonHeight - rectangleHeight) / 2;
  const rectangleLeft = (hexagonWidth - rectangleWidth) / 2;
  const iconHeight = hexagon.imageStyle ? hexagon.imageStyle.height : hexagon.size / 2;
  const iconWidth = hexagon.imageStyle ? hexagon.imageStyle.width : hexagon.size / 2;
  const iconTop = (hexagonHeight - iconHeight) / 2;
  const iconLeft = (hexagonWidth - iconWidth) / 2;
  const textContainerWidth = hexagonWidth * 0.9;
  const textContainerHeight = hexagonHeight / 2;
  const textContainerTop = (hexagonHeight - textContainerHeight) / 2;
  const textContainerLeft = (hexagonWidth * 0.1) / 2;
  return {
    hexagonWidth,
    hexagonHeight,
    rectangleWidth,
    rectangleHeight,
    rectangleTop,
    rectangleLeft,
    iconWidth,
    iconHeight,
    iconTop,
    iconLeft,
    textContainerWidth,
    textContainerHeight,
    textContainerTop,
    textContainerLeft,
  };
}

// When the consumer sets the position to absolute he wants to use it
// in a grid, so we shouldn't include the hexagon width and height
// to prevent onPress binding to the incorrect hexagon
// (when width and height is set, the corners triggers onPress)
function shouldIncludeHexagonWidthAndHeight(hexagon) {
  return !hexagon.style || hexagon.style.position !== 'absolute';
}

export function getStyles(hexagon) {
  const {
    hexagonWidth,
    hexagonHeight,
    rectangleWidth,
    rectangleHeight,
    rectangleTop,
    rectangleLeft,
    iconWidth,
    iconHeight,
    iconTop,
    iconLeft,
    textContainerWidth,
    textContainerHeight,
    textContainerTop,
    textContainerLeft,
  } = getDimensions(hexagon);
  return {
    hexagon: {
      opacity: hexagon.opacity,
      ...shouldIncludeHexagonWidthAndHeight(hexagon) ? {
        width: hexagonWidth,
        height: hexagonHeight
      } : null,
    },
    rectangle: {
      borderTopWidth: hexagon.borderWidth,
      borderBottomWidth: hexagon.borderWidth,
      borderColor: hexagon.borderColor || hexagon.color,
      backgroundColor: hexagon.backgroundColor,
      width: rectangleWidth,
      height: rectangleHeight,
      overflow: 'hidden',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: rectangleTop,
      left: rectangleLeft,
    },
    rectangle1: {
      transform: [{ rotate: hexagon.isHorizontal ? '60deg' : '30deg' }],
    },
    rectangle1Content: {
      transform: [{ rotate: hexagon.isHorizontal ? '-60deg' : '-30deg' }],
    },
    rectangle2: {
      transform: [{ rotate: hexagon.isHorizontal ? '0deg' : '-90deg' }],
    },
    rectangle2Content: {
      transform: [{ rotate: hexagon.isHorizontal ? '0deg' : '90deg' }],
    },
    rectangle3: {
      transform: [{ rotate: hexagon.isHorizontal ? '-60deg' : '-30deg' }],
    },
    rectangle3Content: {
      transform: [{ rotate: hexagon.isHorizontal ? '60deg' : '30deg' }],
    },
    icon: {
      backgroundColor: 'transparent',
      color: hexagon.color,
      width: iconWidth,
      height: iconHeight,
      position: 'absolute',
      top: iconTop,
      left: iconLeft,
    },
    image: {
      width: iconWidth,
      height: iconHeight,
      position: 'absolute',
      top: iconTop,
      left: iconLeft,
    },
    textContainer: {
      backgroundColor: 'transparent',
      width: textContainerWidth,
      height: textContainerHeight,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: textContainerTop,
      left: textContainerLeft,
    },
    bottomTextContainer: {
      backgroundColor: 'transparent',
      width: textContainerWidth * 100 / hexagonHeight,
      height: 50,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: (hexagonWidth - textContainerWidth * 100 / hexagonHeight) / 2,
    },
    text: {
      color: hexagon.textColor,
      textAlign: 'center',
      fontFamily: 'Panton-Semibold',
      fontWeight: hexagon.textWeight,
      fontSize: hexagon.textSize,
    },
    loading: {
      opacity: 0.3,
    },
    error: {
      opacity: 0.3,
    },
  };
}

export function getGridStyles(grid) {
  return {
    hexagonGrid: {
      width: grid.width,
      height: grid.height,
      position: 'relative',
    },
  };
}
