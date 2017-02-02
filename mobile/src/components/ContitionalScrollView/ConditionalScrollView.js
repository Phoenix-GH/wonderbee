import React, { Component, PropTypes } from 'react';
import { ScrollView, View } from 'react-native';

export class ConditionalScrollView extends Component {
  static propTypes = {
    ...ScrollView.propTypes,
    scrollHeight: PropTypes.number.isRequired,
    style: View.propTypes.style,
    containerComponentStyle: View.propTypes.style
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isScrollable: false
    };

    this.onLayout = ::this.onLayout;
  }

  onLayout(event) {
    if (event.nativeEvent.layout.height > this.props.scrollHeight) {
      if (!this.state.isScrollable) {
        this.setState({
          isScrollable: true
        });
      }
    } else if (event.nativeEvent.layout.height < this.props.scrollHeight) {
      if (this.state.isScrollable) {
        this.setState({
          isScrollable: false
        });
      }
    }
  }

  render() {
    const { children, style, containerComponentStyle, ...props } = this.props;
    const { isScrollable } = this.state;

    return (
      isScrollable ? (
        <ScrollView style={style} {...props}>
          <View onLayout={this.onLayout} style={containerComponentStyle}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View onLayout={this.onLayout} style={containerComponentStyle}>
          {children}
        </View>
      )
    );
  }
}
