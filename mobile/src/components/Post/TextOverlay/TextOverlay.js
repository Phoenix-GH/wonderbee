import React, { Component, PropTypes } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';
import { TextOverlayWrap } from 'AppComponents';
import { WINDOW_WIDTH } from 'AppConstants';
import { angle, distance } from './utilities';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    flexDirection: 'row'
  },
});

const end = {
  x: WINDOW_WIDTH,
  y: WINDOW_WIDTH * 4 / 3,
};

export class TextOverlay extends Component {
  static propTypes = {
    text: PropTypes.object.isRequired,
    panning: PropTypes.bool.isRequired,
    removeWithId: PropTypes.func.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const {
      scale: initailScale = 1,
      rotate: initialRotate = '0deg',
    } = props.text;
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(initailScale),
      rotate: new Animated.Value(initialRotate),
      width: 0,
    };
    this.move = ::this.move;
    this.endMove = ::this.endMove;
    this.onDone = ::this.onDone;
    this.remove = ::this.remove;
    // setting up our listeners
    this.panListener = null;
    this.sizeListener = null;
    this.rotateListener = null;
    this.currentPanValue = { x: 0, y: 0 };
    this.currentScaleValue = 1;
    this.currentRotateValue = 0;
    // utilities
    this.multiTouch = false;
    this.previousDistance = 0;
    this.previousRotate = 0;
    this.panResponder = {};
    this.rotate = 0;
    this.scale = 1;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.panning,
      onMoveShouldSetPanResponder: () => this.props.panning,
      onPanResponderMove: this.move,
      onPanResponderRelease: this.endMove,
    });
  }

  componentDidMount() {
    this.panListener = this.state.pan.addListener(value => this.currentPanValue = value);
    this.sizeListener = this.state.scale.addListener(value => this.currentScaleValue = value);
    this.rotateListener = this.state.rotate.addListener(value => this.currentRotateValue = value);
  }

  componentWillUnmount() {
    this.state.pan.removeListener(this.panListener);
    this.state.scale.removeListener(this.sizeListener);
    this.state.rotate.removeListener(this.rotateListener);
  }

  move(e, gestureState) {
    if (gestureState.numberActiveTouches === 1 && !this.multiTouch) {
      const { pan } = this.state;
      return Animated.event([null, {
        dx: pan.x, dy: pan.y
      }])(e, gestureState);
    } else if (gestureState.numberActiveTouches !== 1) {
      const { height } = this.props.text.size;
      this.multiTouch = true;
      this.previousDistance = this.previousDistance === 0 ?
        distance(e.nativeEvent.touches) : this.previousDistance;
      this.previousRotate = this.previousRotate === 0 ?
        angle(e.nativeEvent.touches) : this.previousRotate;
      const rotateChange = angle(e.nativeEvent.touches) - this.previousRotate;
      this.state.rotate.setValue(
        `${parseFloat(this.rotate) + rotateChange}deg`
      );
      const currentDistance = distance(e.nativeEvent.touches);
      const newScale = ((currentDistance - this.previousDistance + height) / height) * this.scale;
      this.state.scale.setValue(newScale);
    }
  }

  endMove(event) {
    const { pageX, pageY } = event.nativeEvent;
    if (!this.multiTouch) {
      const { x, y } = this.currentPanValue;
      this.state.pan.setOffset({ x, y });
      this.state.pan.setValue({ x: 0, y: 0 });
      if (pageX + 50 > end.x && pageY + 50 > end.y) {
        this.remove();
      }
    } else {
      this.multiTouch = false;
      this.previousDistance = 0;
      this.previousRotate = 0;
      this.scale = this.currentScaleValue.value;
      this.rotate = this.currentRotateValue.value;
    }
  }

  onDone() {
    const { imageWidth, imageHeight } = this.props;
    const { width } = this.state;
    const scale = this.currentScaleValue.value;
    const pan = this.currentPanValue;
    const rotate = this.currentRotateValue.value;
    const { text } = this.props;
    text.initialX += pan.x;
    text.initialY += pan.y;
    text.size = {
      width: imageWidth / WINDOW_WIDTH * width,
      height: imageHeight / (WINDOW_WIDTH * 4 / 3) * text.size.height,
    };
    text.pan = {
      x: text.initialX * imageWidth / WINDOW_WIDTH,
      y: text.initialY * imageHeight / (WINDOW_WIDTH * 4 / 3) + text.size.height / 2,
    };
    const reset = { x: 0, y: 0 };
    this.state.pan.setOffset(reset);
    this.state.pan.setValue(reset);
    return { scale, rotate, ...text };
  }

  remove() {
    Animated.timing(
      this.state.scale, {
        toValue: 0,
        duration: 200,
      }
    ).start(() => this.props.removeWithId(this.props.text.id, 'textOverlays'));
  }

  render() {
    const { pan, scale, rotate } = this.state;
    const { text } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            top: text.initialY,
            left: text.initialX - this.state.width / 2,
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale },
              { rotate }
            ]
          }
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 36, right: 36 }}
        {...this.panResponder.panHandlers}
      >
        <TextOverlayWrap
          filterType={text.filterType}
          onLayout={(event) => this.setState({ width: event.nativeEvent.layout.width })}
        >
          {text.text}
        </TextOverlayWrap>
      </Animated.View>
    );
  }
}
