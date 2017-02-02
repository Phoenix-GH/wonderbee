import React, { Component, PropTypes } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import { getGridStyles, getDimensions } from '../styles';
import { HexagonIcon } from '../HexagonIcon';
import { HexagonImage } from '../HexagonImage';

export class HexagonGrid extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pan: new Animated.ValueXY(),
    };
    this.handleMove = ::this.handleMove;
    this.handleMoveEnd = ::this.handleMoveEnd;
    this.panResponder = {};
  }

  componentWillMount() {
    this.styles = getGridStyles(this.props);
    this.getDimensions();
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: this.handleMove,
      onPanResponderRelease: this.handleMoveEnd,
    });
  }

  componentDidMount() {
    this.panListener = this.state.pan.addListener((value) => this.currentPanValue = value);
  }

  componentWillUnmount() {
    this.state.pan.removeListener(this.panListener);
  }

  getDirections(n) {
    const directions = [];
    const dx = [1, 1, 0, -1, -1, 0];
    const dy = [1, -1, -2, -1, 1, 2];
    let x = 0;
    let y = 0;
    let going = 0;
    for (let i = 0; i < n; i++) {
      directions.push({ x, y });
      x += dx[going];
      y += dy[going];
      const want = (i === 0 ? going + 2 : going + 1) % 6;
      if (!directions.find(dir => dir.x === dx[want] + x && dir.y === dy[want] + y)) {
        going = want;
      }
    }
    return directions.map(({ x, y }) => ({
      x: this.center.x + (this.offsetX * x),
      y: this.center.y + (this.offsetY * y),
    }));
  }

  getDimensions() {
    const {
      width: gridWidth,
      height: gridHeight,
      spacing: gridSpacing,
      hexagonSize,
    } = this.props;
    const {
      hexagonWidth,
      hexagonHeight,
      rectangleWidth,
      rectangleLeft,
    } = getDimensions({ size: hexagonSize });
    this.offsetX = hexagonHeight - (rectangleWidth / 2) + gridSpacing;
    this.offsetY = (rectangleWidth / 2) + rectangleLeft + (gridSpacing / 2);
    this.center = {
      x: (gridHeight - hexagonHeight) / 2,
      y: (gridWidth - hexagonWidth) / 2,
    };
  }


  handleMove(evt, gestureState) {
    return Animated.event([null, {
      dx: this.state.pan.x,
      dy: this.state.pan.y,
    }])(evt, gestureState);
  }

  handleMoveEnd() {
    this.state.pan.setOffset({ x: this.currentPanValue.x, y: this.currentPanValue.y });
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  renderHexagon(hexagon, x, y) {
    const { hexagonSize } = this.props;
    const { type: hexagonType, ...hexagonProps } = hexagon;
    return (
      <View key={`${x}${y}`} style={{ position: 'absolute', top: x, left: y }}>
        {(() => {
          if (hexagonType === 'image') {
            return <HexagonImage {...hexagonProps} size={hexagonSize} />;
          }
          return <HexagonIcon {...hexagonProps} size={hexagonSize} />;
        })()}
      </View>
    );
  }

  render() {
    const { hexagons, style } = this.props;
    const { pan } = this.state;
    return (
      <View style={style} {...this.panResponder.panHandlers}>
        <Animated.View
          style={{ position: 'absolute', left: pan.x, top: pan.y }}
          contentContainerStyle={this.styles.hexagonGrid}
          onResponderRelease={this.handleResponderRelease}
        >
          {this.getDirections(hexagons.length).map(({ x, y }, hexagonIndex) =>
            this.renderHexagon(hexagons[hexagonIndex], x, y)
          )}
        </Animated.View>
      </View>
    );
  }
}

HexagonGrid.defaultProps = {
  spacing: 0,
  scrollEnabled: false,
};

HexagonGrid.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  spacing: PropTypes.number,
  hexagons: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['icon', 'image']),
  })).isRequired,
  hexagonSize: PropTypes.number.isRequired,
  scrollEnabled: PropTypes.bool,
  style: View.propTypes.style,
};
