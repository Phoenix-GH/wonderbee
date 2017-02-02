import React, { Component, PropTypes, Children } from 'react';
import { View, ScrollView } from 'react-native';
import { STATUSBAR_HEIGHT, NAVBAR_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { getDimensions } from '../styles';
import { styles } from './styles';

export class SpiralHexagonGrid extends Component {
  static propTypes = {
    ...View.propTypes,
    spacing: PropTypes.number,
    scrollEnabled: PropTypes.bool,
    hexagonSize: PropTypes.number,
    style: PropTypes.shape({
      ...View.propTypes.style,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    })
  };

  static defaultProps = {
    spacing: 0,
    scrollEnabled: false,
    hexagonSize: 160,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      hexagonDirections: [],
      contentWidth: WINDOW_WIDTH,
      contentHeight: WINDOW_HEIGHT,
      leftInset: 0,
      rightInset: 0,
      topInset: 0,
      bottomInset: 0,
    };
    this.leftLimit = null;
    this.rightLimit = null;
    this.topLimit = null;
    this.bottomLimit = null;
    this.imageHeight = props.hexagonSize;
    this.imageWidth = 2 * props.hexagonSize / Math.sqrt(3);
    this.getHexagonDirections = ::this.getHexagonDirections;
    this.getHexagonXByIndex = ::this.getHexagonXByIndex;
    this.getHexagonYByIndex = ::this.getHexagonYByIndex;
    this.onHexagonsLayout = ::this.onHexagonsLayout;
    this.hexagonsLength = 0;
    this.hexagonsCount = 0;
  }

  componentDidMount() {
    this.updateHexagonDirections(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateHexagonDirections(nextProps);
  }

  onHexagonsLayout(evt) {
    const { x, y } = evt.nativeEvent.layout;
    if (this.leftLimit === null) {
      this.leftLimit = x;
      this.rightLimit = x;
      this.topLimit = y;
      this.bottomLimit = y;
    }
    this.hexagonsCount++;
    if (x < this.leftLimit) {
      this.leftLimit = x;
    }
    if (x > this.rightLimit) {
      this.rightLimit = x;
    }
    if (y < this.topLimit) {
      this.topLimit = y;
    }
    if (y > this.bottomLimit) {
      this.bottomLimit = y;
    }

    if (this.hexagonsCount === this.hexagonsLength) {
      this.rightLimit = this.rightLimit + this.imageWidth;
      this.bottomLimit = this.bottomLimit + this.imageHeight + STATUSBAR_HEIGHT;
      this.topLimit = this.topLimit + STATUSBAR_HEIGHT;

      const insetX = -this.leftLimit;
      const insetY = -this.topLimit + NAVBAR_HEIGHT - STATUSBAR_HEIGHT;

      if (this.bottomLimit - this.leftLimit > WINDOW_HEIGHT - STATUSBAR_HEIGHT) {
        this.setState({
          contentHeight: this.bottomLimit - this.topLimit - STATUSBAR_HEIGHT + 2 * NAVBAR_HEIGHT,
          topInset: insetY,
          bottomInset: -insetY - STATUSBAR_HEIGHT,
        });
      }
      if (this.rightLimit - this.leftLimit > WINDOW_WIDTH) {
        this.setState({
          contentWidth: this.rightLimit - this.leftLimit,
          leftInset: insetX,
          rightInset: -insetX,
        });
      }
    }
  }

  getHexagonXByIndex(hexagon, hexagonIndex) {
    const { style, spacing } = this.props;
    const { hexagonHeight } = getDimensions(hexagon.props);
    const gridXCenter = (style.height - hexagonHeight) / 2;
    const hexagonX = this.state.hexagonDirections[hexagonIndex].x;
    const hexagonXOffset = (hexagonHeight / 2) + (spacing / 2);
    return gridXCenter + (hexagonX * hexagonXOffset);
  }

  getHexagonYByIndex(hexagon, hexagonIndex) {
    const { spacing, style } = this.props;
    const { hexagonWidth } = getDimensions(hexagon.props);
    const gridYCenter = (style.width - hexagonWidth) / 2;
    const hexagonY = this.state.hexagonDirections[hexagonIndex].y;
    const hexagonYOffset = (hexagonWidth * 0.75) + spacing;
    return gridYCenter + (hexagonY * hexagonYOffset);
  }

  // TODO: refactor getHexagonDirections()
  // We need to make it easy to reason about
  getHexagonDirections(hexagonCount) {
    const directions = [];
    const findDirectionByXAndY = (x, y) => directions.find(dir => dir.x === x && dir.y === y);
    const dx = [1, 2, 1, -1, -2, -1];
    const dy = [1, 0, -1, -1, 0, 1];
    let x = 0;
    let y = 0;
    let going = 0;
    for (let i = 0; i < hexagonCount; i++) {
      directions.push({ x, y });
      x += dx[going];
      y += dy[going];
      const want = (i === 0 ? going + 2 : going + 1) % 6;
      const wantX = dx[want] + x;
      const wantY = dy[want] + y;
      if (!findDirectionByXAndY(wantX, wantY)) {
        going = want;
      }
    }
    return directions;
  }

  updateHexagonDirections({ children }) {
    this.hexagonsLength = children.length;
    this.setState({
      hexagonDirections: this.getHexagonDirections(Children.count(children))
    });
  }

  render() {
    const { style, children } = this.props;
    const {
      hexagonDirections,
      contentWidth,
      contentHeight,
      leftInset,
      rightInset,
      topInset,
      bottomInset
    } = this.state;
    if (!hexagonDirections.length) {
      return null;
    }
    return (
      <View
        style={[{ overflow: 'hidden' }, style]}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight, width: contentWidth }}
          contentInset={{
            left: leftInset,
            right: rightInset,
            top: topInset,
            bottom: bottomInset,
          }}
        >
          {Children.map(children, (hexagon, hexagonIndex) => (
            <View
              style={{
                position: 'absolute',
                top: this.getHexagonXByIndex(hexagon, hexagonIndex),
                left: this.getHexagonYByIndex(hexagon, hexagonIndex)
              }}
              onLayout={this.onHexagonsLayout}
            >
              {hexagon}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
