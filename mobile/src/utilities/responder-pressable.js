const MAX_DISTANCE = 10;

export class ResponderPressable {
  constructor(props, maxDistance = MAX_DISTANCE) {
    const {
      onPress,
      ...inputProps
    } = props;
    this._startX = null;
    this._startY = null;
    this._pressStart = null;
    this._disabled = false;
    this._onPress = onPress;
    this._inputProps = inputProps;
    this._maxDistance = maxDistance;
    this.tryProp = ::this._tryProp;
    this.props = {
      ...this._inputProps,
      onStartShouldSetResponder: ::this._onStartShouldSetResponder,
      onResponderRelease: ::this._onResponderRelease,
      onResponderMove: ::this._onResponderMove,
      onResponderTerminate: ::this._onResponderTerminate,
      onMoveShouldSetResponder: ::this._onMoveShouldSetResponder,
    };
  }

  _tryProp(method, evt) {
    if (this._inputProps.hasOwnProperty(method)) {
      return this._inputProps[method](evt);
    }
    return true;
  }

  _onStartShouldSetResponder(evt) {
    this._startX = evt.nativeEvent.locationX;
    this._startY = evt.nativeEvent.locationY;
    return this._tryProp('onStartShouldSetResponder', evt);
  }

  _onResponderRelease(evt) {
    if (! this._disabled) {
      if (this._onPress) {
        this._onPress(evt);
      }
    }

    this._startX = null;
    this._startY = null;
    this._disabled = false;
    return this._tryProp('onResponderRelease', evt);
  }

  _onMoveShouldSetResponder(evt) {
    return this._tryProp('onMoveShouldSetResponder', evt);
  }

  _onResponderMove(evt) {
    if (this._disabled) {
      return false;
    }

    const { nativeEvent } = evt;
    const distanceX = Math.abs(this._startX - nativeEvent.locationX);
    const distanceY = Math.abs(this._startY - nativeEvent.locationY);

    if (distanceX >= this._maxDistance || distanceY >= this._maxDistance) {
      this._disabled = true;
    }

    return this._tryProp('onResponderMove', evt);
  }

  _onResponderTerminate(evt) {
    return this._tryProp('onResponderTerminate', evt);
  }
}
