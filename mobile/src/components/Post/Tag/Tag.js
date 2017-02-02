import React, { Component, PropTypes } from 'react';
import { Animated, View, PanResponder, Text, StyleSheet } from 'react-native';
import { GRAY, WHITE } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY,
    padding: 5,
    height: 30,
    position: 'absolute',
  },
  username: {
    color: WHITE,
  },
});

const end = {
  x: WINDOW_WIDTH - 10,
  y: WINDOW_WIDTH * 4 / 3 - 10,
};

export class Tag extends Component {
  static propTypes = {
    tag: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      initialX: PropTypes.number.isRequired,
      initialY: PropTypes.number.isRequired,
    }),
    panning: PropTypes.bool.isRequired,
    removeWithId: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
    };
    this.move = ::this.move;
    this.endMove = ::this.endMove;
    this.onDone = ::this.onDone;
    this.remove = ::this.remove;
    this.panListener = null;
    this.currentPanValue = { x: 0, y: 0 };
    this.panResponder = {};
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
  }

  componentWillUnmount() {
    this.state.pan.removeListener(this.panListener);
  }

  move(event, gestureState) {
    const { pan } = this.state;
    return Animated.event([null, {
      dx: pan.x, dy: pan.y
    }])(event, gestureState);
  }

  endMove(event) {
    const { x, y } = this.currentPanValue;
    const { pageX, pageY } = event.nativeEvent;
    this.state.pan.setOffset({ x, y });
    this.state.pan.setValue({ x: 0, y: 0 });
    if (pageX + 50 > end.x && pageY + 50 > end.y) {
      this.remove();
    }
  }

  remove() {
    Animated.timing(
      this.state.scale, {
        toValue: 0,
        duration: 200,
      }
    ).start(() => this.props.removeWithId(this.props.tag.id, 'tags'));
  }

  onDone() {
    const { tag } = this.props;
    const pan = this.currentPanValue;
    tag.initialX += pan.x;
    tag.initialY += pan.y;
    const reset = { x: 0, y: 0 };
    this.state.pan.setOffset(reset);
    this.state.pan.setValue(reset);
    return tag;
  }

  render() {
    const { tag } = this.props;
    const { pan, scale } = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          { top: tag.initialY, left: tag.initialX },
          { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }] }
        ]}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        {...this.panResponder.panHandlers}
      >
        <Text style={styles.username}>
          {tag.username}
        </Text>
      </Animated.View>
    );
  }
}
