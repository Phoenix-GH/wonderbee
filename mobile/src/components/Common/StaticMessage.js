import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export class StaticMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['top', 'bottom']).isRequired,
    distanceFromBorder: PropTypes.number,
  };

  static defaultProps = {
    distanceFromBorder: 50,
  };

  constructor(props, context) {
    super(props, context);

    const { direction, distanceFromBorder } = this.props;
    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        [direction]: distanceFromBorder,
        left: 0,
        right: 0,
        marginHorizontal: 20,
      }
    });
  }

  render() {
    const { message } = this.props;
    return (
      <View style={[this.styles.container]}>
        <Text>{message}</Text>
      </View>
    );
  }
}
