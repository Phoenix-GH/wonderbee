import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, Image } from 'react-native';
import { NAVBAR_HEIGHT, WINDOW_WIDTH, STATUSBAR_HEIGHT } from 'AppConstants';
import { LIGHT_GRAY, BLACK } from 'AppColors';

export class TopBanner extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    defaultTitle: PropTypes.string.isRequired,
    userInfo: PropTypes.object,
    showBanner: PropTypes.bool.isRequired,
    connectionLost: PropTypes.bool,
    connectionLostMessage: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    showBanner: false,
    userInfo: {},
    connectionLost: false,
    connectionLostMessage: 'Connection lost!',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      top: new Animated.Value(-20 - NAVBAR_HEIGHT - STATUSBAR_HEIGHT),
    };
    this.handleRelease = ::this.handleRelease;
    this.handleMove = ::this.handleMove;
    this.hideBanner = ::this.hideBanner;
    this.showBanner = ::this.showBanner;
    this.renderConnectionLost = ::this.renderConnectionLost;
    this.panResponder = null;
    this._timeout = null;
    this.onMove = false;
    this.imageSource = require('image!push_icon');
    this.bannerHeight = NAVBAR_HEIGHT + STATUSBAR_HEIGHT;
    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: LIGHT_GRAY,
        left: 0,
        right: 0,
        height: this.bannerHeight + 20,
        flexDirection: 'row',
      },
      connectionLostContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        left: 0,
        right: 0,
        height: 2 * STATUSBAR_HEIGHT + 20,
      },
      imageContainer: {
        height: 50,
        width: 50,
        marginTop: 50,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white',
      },
      bottom: {
        position: 'absolute',
        bottom: 4,
        height: 6,
        width: 30,
        borderRadius: 3,
        backgroundColor: 'gray',
        left: WINDOW_WIDTH / 2 - 15,
      },
      textContainer: {
        flexDirection: 'column',
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10
      },
      warningText: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 5,
        textAlign: 'center',
        color: 'white'
      },
      text: {
        color: BLACK,
        width: WINDOW_WIDTH - 80,
      }
    });
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handleMove,
      onPanResponderRelease: this.handleRelease,
    });
  }

  componentDidMount() {
    const { showBanner, connectionLost } = this.props;
    if (showBanner || connectionLost) {
      this.showBanner();
    }
  }

  componentWillReceiveProps(newProps) {
    const { showBanner, connectionLost } = newProps;
    if (showBanner || connectionLost) {
      this.showBanner();
    }
  }

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  handleRelease() {
    this.onMove = false;
    this.hideBanner();
  }

  hideBanner() {
    Animated.spring(this.state.top, {
      toValue: -this.bannerHeight - 20,
      duration: 300
    }).start();
  }

  showBanner() {
    Animated.spring(this.state.top, {
      toValue: -20,
      duration: 300
    }).start();
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      if (!this.onMove) {
        this.hideBanner();
      }
    }, 5000);
  }

  handleMove(evt, gestureState) {
    this.onMove = true;
    if (gestureState.dy < 0) {
      Animated.event([null, {
        dy: this.state.top
      }])(evt, gestureState);
    }
  }

  renderConnectionLost() {
    const { connectionLostMessage } = this.props;
    const { top } = this.state;
    return (
      <Animated.View
        style={[this.styles.connectionLostContainer, { top }]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={this.styles.warningText}
        >
          {connectionLostMessage}
        </Text>
      </Animated.View>
    );
  }
  render() {
    const { defaultTitle, message, userInfo, connectionLost, showBanner } = this.props;
    const { top } = this.state;
    const titleText = (userInfo && userInfo.name) ? userInfo.name : defaultTitle;
    const image = (userInfo && userInfo.avatarUrl) ? { uri: userInfo.avatarUrl } : this.imageSource;

    if (connectionLost) {
      return this.renderConnectionLost();
    }
    if (showBanner) {
      return (
        <Animated.View
          style={[this.styles.container, {top}]}
          {...this.panResponder.panHandlers}
        >
          <Image
            style={this.styles.imageContainer}
            source={image}
          />
          <View style={this.styles.textContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={this.styles.text}
            >
              {titleText}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={this.styles.text}
            >
              {message}
            </Text>
          </View>
          <View style={this.styles.bottom}/>
        </Animated.View>
      );
    }
    return null;
  }
}
