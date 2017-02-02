import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export class Order extends Component {
  static propTypes = {
    children: PropTypes.any,
    by: PropTypes.string,
    direction: PropTypes.string,
    style: View.propTypes.style,
  }

  static defaultProps = {
    by: 'order',
    direction: 'column',
    style: {},
  }

  constructor(props, context) {
    super(props, context);
    this.sortBy = ::this.sortBy;
  }

  sortBy(array, key) {
    return array.sort((a, b) => {
      const x = a.props[key];
      const y = b.props[key];
      if (x < y) {
        return -1;
      }
      return x > y ? 1 : 0;
    });
  }

  render() {
    return (
      <View style={[styles.container, { flexDirection: this.props.direction }, this.props.style]}>
        {this.sortBy(this.props.children, this.props.by)}
      </View>
    );
  }
}
