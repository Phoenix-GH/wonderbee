/**
 * Created by nick on 08/06/16.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import { View, WebView, PanResponder, StyleSheet } from 'react-native';

export class Canvas extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    drawParameter: PropTypes.object,
    context: PropTypes.object,
    render: PropTypes.func.isRequired,
    onPanResponderRelease: PropTypes.func,
    onPanResponderMove: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this._createComponentProps = ::this._createComponentProps;
    this._panResponder = null;

    if (props.onPanResponderRelease && props.onPanResponderMove) {
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onPanResponderMove: props.onPanResponderMove,
        onPanResponderRelease: props.onPanResponderRelease
      });
    }
  }

  componentWillMount() {
    this._createComponentProps(this.props);
  }

  componentWillUpdate(nextProps) {
    this._createComponentProps(nextProps);
  }

  _createComponentProps(containerProps) {
    const props = {};
    if (containerProps.style) {
      props.style = containerProps.style;
    }
    this._componentProps = props;
  }

  render() {
    const contextString = JSON.stringify(this.props.context);
    const renderString = this.props.render.toString();
    const param = JSON.stringify({
      width: this.props.width,
      height: this.props.height,
      ...this.props.drawParameter
    });

    const source = '<style>body, canvas { margin:0px; padding:0px; width: 100%; height: 100%; }' +
      '</style><body><canvas></canvas></body>' +
      '<script>var canvas = document.querySelector("canvas");' +
      `(${renderString}).call(${contextString}, canvas, ${param});</script>`;
    const styles = StyleSheet.create({
      webView: {
        width: this.props.width,
        height: this.props.height,
        backgroundColor: 'transparent'
      }
    });

    return (
      <View {...this._componentProps}
        {...this._panResponder.panHandlers}
      >
        <WebView
          automaticallyAdjustContentInsets={false}
          source={{ html: source }}
          scrollEnabled={false}
          style={ styles.webView }
        />
      </View>
    );
  }
}
