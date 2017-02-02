import React, { Component, PropTypes } from 'react';
import { View, Animated, Text, PanResponder } from 'react-native';
import { Close } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { styles } from './styles';

export class SelectedUser extends Component {
  static defaultProps = {
    nameKey: 'username',
    removeY: 100,
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    removeSelected: PropTypes.func.isRequired,
    nameKey: PropTypes.string.isRequired,
    style: View.propTypes.style,
    textStyle: Text.propTypes.style,
    removeY: PropTypes.number,
    removeWithClick: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      pan: new Animated.ValueXY(),
    };

    this.panResponderMove = ::this.panResponderMove;
    this.panResponderEnd = ::this.panResponderEnd;
    this.animating = false;
    this.moveStyles = null;
    this.panListener = null;
    this.panResponder = null;
    this.currentPanValue = null;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.animating,
      onMoveShouldSetPanResponder: () => !this.animating,
      onPanResponderMove: this.panResponderMove,
      onPanResponderRelease: this.panResponderEnd,
      onPanResponderTerminate: this.panResponderEnd,
    });
  }

  componentDidMount() {
    this.panListener = this.state.pan.addListener(value => this.currentPanValue = value);
  }

  componentWillUnmount() {
    this.state.pan.removeListener(this.panListener);
  }

  panResponderMove(event, gestureState) {
    const move = Animated.event([
      null, { dx: this.state.pan.x, dy: this.state.pan.y }
    ]);
    return move(event, gestureState);
  }

  panResponderEnd(event, gestureState) {
    if (gestureState.dy > this.props.removeY) {
      const { removeSelected, user } = this.props;
      return removeSelected(user);
    }
    this.animating = true;
    return Animated.timing(
      this.state.pan, {
        toValue: { x: 0, y: 0 },
        duration: 100,
      }
    ).start(() => (this.animating = false));
  }

  render() {
    const { user, nameKey, textStyle, style, removeWithClick, removeSelected } = this.props;
    const { pan } = this.state;
    return (
    removeWithClick ? <View style={[styles.userButton, { flexDirection: 'row' }, style]}>
      <LabelText style={textStyle}> {user[nameKey]}</LabelText>
      <Close
        close={() => removeSelected(user)}
        style={styles.close}
      />
    </View> :
    <Animated.View
      {...this.panResponder.panHandlers}
      style={{
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
        ],
        zIndex: 10,
      }}
    >
      <View style={[styles.userButton, style]}>
          <LabelText style={textStyle}> {user[nameKey]}</LabelText>
      </View>
    </Animated.View>
    );
  }
}
