import React, { PropTypes, Component } from 'react';
import { View, Image, StyleSheet, LayoutAnimation } from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const sources = {
  green: require('image!gradient_green'),
  blue: require('image!gradient')
};

export class BackgroundAccounts extends Component {
  static propTypes = {
    style: View.propTypes.style,
    imageStyles: Image.propTypes.style,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    type: PropTypes.oneOf(['green', 'blue']),
    children: PropTypes.any.isRequired,
    onLoad: PropTypes.func
  };
  static defaultProps = {
    type: 'blue',
    imageWidth: WINDOW_WIDTH,
    imageHeight: WINDOW_HEIGHT,
    onLoad: () => {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loaded: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const {
      style,
      children,
      onLoad,
      type,
      imageStyles,
      imageWidth,
      imageHeight,
    } = this.props;
    const { loaded } = this.state;
    const imageSource = sources[type];
    return (
      <View
        style={[styles.container, style]}
      >
        <Image
          onLoadEnd={() => {
            this.setState({ loaded: true });
            onLoad();
          }}
          resizeMode={'cover'}
          source={imageSource}
          style={[styles.image, imageStyles]}
          width={imageWidth}
          height={imageHeight}
        />
        {loaded ? children : null}
      </View>
    );
  }
}
