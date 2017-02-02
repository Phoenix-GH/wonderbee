import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BG_LIGHT_GRAY } from 'AppColors';
import { Colony360View, ColonyPost } from 'AppComponents';
import range from 'lodash/range';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_LIGHT_GRAY,
    position: 'relative',
  },
  post: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default class Colony360ViewExample extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { post: null };
    this.handleTopicPress = ::this.handleTopicPress;
  }

  handleTopicPress(topic) {
    if (topic.type === 'post') {
      this.setState({ post: topic });
    }
  }

  render() {
    const { post } = this.state;
    return (
      <View style={styles.container}>
        <Colony360View
          colonyName="Testing"
          topics={range(100).map(i => ({
            type: 'post',
            id: `topic${i + 1}`,
            imageUrl: `https://unsplash.it/300/?image=${Math.ceil(i * Math.random() * 30)}`,
            title: `Topic ${i + 1}`,
            subtitle: 'Lorem ipsum dolor sit amet?',
            isTrending: false,
          }))}
          onTopicPress={this.handleTopicPress}
        />
        {post && <ColonyPost post={post} style={styles.post} />}
      </View>
    );
  }
}
