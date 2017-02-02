import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { EmptyFeedHeader, EmptyFeedAction } from 'AppComponents';
import { styles } from './styles';

class EmptyFeedContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    goToHive: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <EmptyFeedHeader style={styles.marginBottom} />
        <EmptyFeedAction goToHive={this.props.goToHive} />
      </View>
    );
  }
}

export default connectFeathers(EmptyFeedContainer);
