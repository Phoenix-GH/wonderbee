import React from 'react';
import _ from 'lodash';
import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  STATUSBAR_HEIGHT,
  HEXAGON_SIZE,
  HEXAGON_PADDING
} from 'AppConstants';

import { HexagonImage, HexagonIcon } from 'AppComponents';

function imageWidth(size) {
  return 2 * size / Math.sqrt(3);
}

export function getHexagonLayout(numOfRows) {
  const hexSizeHoriz = HEXAGON_SIZE;
  const hexImageSize = imageWidth(hexSizeHoriz);
  const hexSizeVert = hexImageSize / 2;
  const hexPaddingHoriz = HEXAGON_PADDING;
  const hexPaddingVert = hexPaddingHoriz * Math.sqrt(3) / 2;
  const numOfHexagonsPerRow = Math.floor(
    (WINDOW_WIDTH - hexPaddingHoriz) / (hexSizeHoriz + hexPaddingHoriz)
  );
  const numOfHexagonsPerCol = _.isNil(numOfRows) ?
    Math.floor(
      (WINDOW_HEIGHT - STATUSBAR_HEIGHT - hexPaddingVert) / (3 * hexSizeVert / 2 + hexPaddingVert)
    ) : numOfRows;
  const firstLeft = (WINDOW_WIDTH - hexPaddingHoriz -
    numOfHexagonsPerRow * (hexSizeHoriz + hexPaddingHoriz)) / 2;
  const firstTop = (WINDOW_HEIGHT - STATUSBAR_HEIGHT - hexPaddingVert -
    numOfHexagonsPerCol * (hexSizeVert + hexPaddingVert)) / 2;

  let leftMostCenterPosX = 0;
  let topMostCenterPosY = 0;
  let maxCols = numOfHexagonsPerRow;
  let maxRows = numOfHexagonsPerCol;

  let startingCenterX = 0;
  let cols = 0;

  if (firstLeft > 0) {
    leftMostCenterPosX = firstLeft - hexSizeHoriz / 2;
    maxCols = maxCols + 2;
    cols = maxCols - 1;
    startingCenterX = firstLeft + hexPaddingHoriz / 2;
    if (!_.isNil(numOfRows) && numOfRows % 2 === 1 && cols % 2 === 0) {
      cols = cols + 1;
      startingCenterX = startingCenterX - hexPaddingHoriz / 2 - hexSizeHoriz / 2;
    }
  } else {
    leftMostCenterPosX = firstLeft + hexPaddingHoriz / 2;
    maxCols = maxCols + 1;
    cols = maxCols;
    startingCenterX = firstLeft + hexPaddingHoriz / 2;
    if (!_.isNil(numOfRows) && numOfRows % 2 === 1 && cols % 2 === 0) {
      cols = cols - 1;
      startingCenterX = startingCenterX + hexPaddingHoriz / 2 + hexSizeHoriz / 2;
    }
  }
  if (firstTop > 0) {
    // initialCenterPosY = firstTop - hexSizeVert / 2 - hexPaddingVert;
    topMostCenterPosY = -hexSizeVert / 2 - hexPaddingVert;
    maxRows = _.isNil(numOfRows) ? maxRows + 2 : numOfRows;
  } else {
    // initialCenterPosY = firstTop + hexSizeVert;
    topMostCenterPosY = hexSizeVert;
    maxRows = _.isNil(numOfRows) ? maxRows + 1 : numOfRows;
  }

  const hexagonsArr = [];
  for (let i = 0; i < maxRows; i++) {
    const startingCenterY = topMostCenterPosY + i * (3 * hexSizeVert / 2 + hexPaddingVert);
    const subArr = [];
    for (let j = 0; j < cols; j++) {
      // const url = avatars[_.random(0, avatars.length - 1)];
      subArr.push({
        center: {
          x: startingCenterX + j * (hexSizeHoriz + hexPaddingHoriz),
          y: startingCenterY
        }
      });
    }
    hexagonsArr.push(subArr);
    cols = cols === maxCols ? cols - 1 : cols + 1;
    startingCenterX = startingCenterX !== leftMostCenterPosX ? leftMostCenterPosX
      : (startingCenterX + (firstLeft > 0 ? 1 : -1) * (hexSizeHoriz + hexPaddingHoriz) / 2);
  }
  return hexagonsArr;
}

export function renderHexagonImages(hexArr) {
  return hexArr.map((h) => <HexagonImage
    {...h}
    style={{
      ...h.style,
      position: 'absolute',
      left: h.center.x - HEXAGON_SIZE / 2,
      top: h.center.y - imageWidth(HEXAGON_SIZE) / 2
    }}
  />);
}

export function renderHexagonIcons(hexArr) {
  return hexArr.map((h) => <HexagonIcon
    {...h}
    style={{
      ...h.style,
      position: 'absolute',
      left: h.center.x - HEXAGON_SIZE / 2,
      top: h.center.y - imageWidth(HEXAGON_SIZE) / 2
    }}
  />);
}
