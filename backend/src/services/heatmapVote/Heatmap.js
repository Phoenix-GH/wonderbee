import heatmap from 'heatmap2';

export default class Heatmap {
  constructor(size, pointSize, ratio) {
    if (typeof size !== 'number') {
      throw new Error(`${JSON.stringify(size)} is not a number; size should be a number`);
    }
    if (typeof pointSize !== 'number') {
      throw new Error(`${JSON.stringify(pointSize)} is not a number; pointSize should be a number`);
    }
    this.size = size;
    this.ratio = ratio;
    this.pointSize = pointSize;
    this.pointCenter = this.getPointCenter();
  }

  init() {
    this.heatmap = heatmap(this.size, this.size / this.ratio, { radius: this.pointSize * 1.5 });
  }

  getSize() {
    return this.size;
  }

  getPointCenter() {
    return this.pointSize / 2;
  }

  getPositions() {
    const positions = [];
    for (let x = 0; x <= this.size; x += this.pointSize) {
      for (let y = 0; y <= this.size / this.ratio; y += this.pointSize) {
        positions.push({
          x: x + this.pointCenter,
          y: y + this.pointCenter,
        });
      }
    }
    return positions;
  }

  findClosestPosition(x, y) {
    console.log(x, y);
    if (typeof x !== 'number') {
      throw new Error(`${JSON.stringify(x)} is not a number; x should be a number`);
    }
    if (typeof y !== 'number') {
      throw new Error(`${JSON.stringify(y)} is not a number; y should be a number`);
    }
    const positions = this.getPositions();
    const closest = positions.find(position => (
      x >= position.x - this.pointCenter
      && x <= position.x - this.pointCenter + this.pointSize
      && y >= position.y - this.pointCenter
      && y <= position.y - this.pointCenter + this.pointSize
    ));
    // If no position was found, the last will be used
    if (!closest) {
      return positions[positions.length - 1];
    }
    return closest;
  }

  addPoint(x, y, weight) {
    if (typeof x !== 'number') {
      throw new Error(`${JSON.stringify(x)} is not a number; x should be a number`);
    }
    if (typeof y !== 'number') {
      throw new Error(`${JSON.stringify(y)} is not a number; y should be a number`);
    }
    if (typeof weight !== 'number') {
      throw new Error(`${JSON.stringify(weight)} is not a number; weight should be a number`);
    }
    if (weight <= 0 || weight > 1) {
      throw new Error(`${weight} is out of range; weight should be a number greater than 0 and equal to or lower than 1`);
    }
    if (!this.heatmap) {
      throw new Error('You should init() the heatmap before adding points to it');
    }
    return this.heatmap.addPoint(x, y, { weight });
  }

  draw() {
    if (!this.heatmap) {
      throw new Error('You should init() the heatmap before drawing it');
    }
    return this.heatmap.draw();
  }

  toDataURL() {
    if (!this.heatmap) {
      throw new Error('You should init() the heatmap before converting it to Data URL');
    }
    return this.heatmap.canvas.toDataURL();
  }
}
