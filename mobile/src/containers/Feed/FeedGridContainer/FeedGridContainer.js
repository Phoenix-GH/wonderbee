import React, { Component, PropTypes } from 'react';
import { ListView, RefreshControl, Alert, View } from 'react-native';
import { PostTile } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { POST_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { LIGHT_GRAY } from 'AppColors';
import { range } from 'lodash';

const POST_LIMIT = 10;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});


class FeedGridContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeToFeedItem: PropTypes.func.isRequired,
    refreshing: PropTypes.bool,
    refreshDone: PropTypes.func,
    handles: PropTypes.array,
    locations: PropTypes.array,
    hashtags: PropTypes.array,
    postCount: PropTypes.number,
  };

  static defaultProps = {
    refreshing: false,
    handles: [],
    locations: [],
    hashtags: [],
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      posts: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      refreshing: false,
      $skip: 0,
      loading: false,
      hasPosts: false,
      hasMoreToLoad: true,
      postsLoaded: false,
    };
    this.posts = [];
    this.findPostsPromise = null;
    this.listViewSize = { width: 0, height: 0 };
    this.renderTile = ::this.renderTile;
    this.onRefresh = ::this.onRefresh;
    this.deletePostOverlay = ::this.deletePostOverlay;
    this.deletePost = ::this.deletePost;
  }

  componentWillMount() {
    this.getPosts();
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.refreshing && !!newProps.refreshing) {
      this.getPosts();
    }
  }

  componentWillUnmount() {
    if (this.findPostsPromise) {
      this.findPostsPromise.cancel();
    }
  }

  onRefresh() {
    this.setState({ refreshing: true }, () => this.getPosts());
  }

  getPosts(loadMore) {
    const { feathers, handles, hashtags, locations } = this.props;
    const { $skip, loading, refreshing, hasMoreToLoad } = this.state;

    if (loadMore && !hasMoreToLoad) {
      return;
    }
    if (!loading) {
      this.setState({ loading: true });
    } else {
      return;
    }
    const postService = feathers.service(POST_SERVICE);
    const query = {
      $skip: refreshing ? 0 : $skip,
      $limit: 15,
    };
    if (handles.length > 0) {
      query.userId = { $in: handles };
    }
    if (locations.length > 0) {
      query.locations = { $in: locations };
    }
    if (hashtags.length > 0) {
      query.hashtags = { $in: hashtags };
    }
    const alwaysSet = {
      initialRender: true,
      loading: false,
      refreshing: false,
      postsLoaded: true,
    };
    const parentRefreshCallback = () => {
      if (this.props.refreshing && !!this.props.refreshDone) {
        this.props.refreshDone();
      }
    };
    this.getPostPromise = makeCancelable(postService.find({ query }));
    this.getPostPromise
    .promise
      .then(posts => {
        if (posts.data.length > 0) {
          this.posts = refreshing ? posts.data : this.posts.concat(posts.data);
          this.setState({
            ...alwaysSet,
            limit: posts.limit,
            posts: this.state.posts.cloneWithRows(this.posts),
            $skip: refreshing ? posts.limit : $skip + posts.limit,
            hasPosts: posts.total > 0,
            hasMoreToLoad: posts.data.length === 15,
          }, parentRefreshCallback);
        } else {
          this.setState({ ...alwaysSet, hasMoreToLoad: false }, parentRefreshCallback);
        }
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
        this.setState({
          refreshing: false,
        });
      });
  }

  deletePost(postId) {
    const { feathers } = this.props;
    feathers.service(POST_SERVICE).remove(postId)
    .then(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.setState({
        posts: this.state.posts.cloneWithRows(this.posts),
      });
    });
  }

  deletePostOverlay(postId) {
    Alert.alert('Do you want to delete this post?', null, [
      { text: 'Cancel', onPress: () => null },
      { text: 'Confirm', onPress: () => this.deletePost(postId) },
    ]);
  }

  renderTile(post, section, row) {
    const { routeToFeedItem } = this.props;
    const style = parseInt(row, 10) < 3 ? styles.topRow : {};

    return (
      <PostTile
        imageUrl={post.preview.url}
        routeToFeedItem={() => this.state.postsLoaded && routeToFeedItem('FeedScene', {
          singlePost: post,
          hasNavBar: false,
          navBarCenterLabel: post.createdBy.username,
          hasTopFilterBar: false,
        })}
        deletePost={() => this.deletePostOverlay(post.id)}
        style={[style, { backgroundColor: LIGHT_GRAY }]}
      />
    );
  }

  renderBlankTiles() {
    const { postCount } = this.props;
    const tileNum = range(postCount < POST_LIMIT ? postCount : POST_LIMIT);
    return (
      <View style={styles.container}>
        {tileNum.map((tile, i) => (
          <PostTile key={i} />
        ))}
      </View>
    );
  }

  render() {
    const { posts, refreshing, postsLoaded } = this.state;
    return postsLoaded ? (
      <ListView
        contentContainerStyle={styles.container}
        dataSource={posts}
        pageSize={3}
        renderRow={this.renderTile}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing && !this.props.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        onEndReachedThreshold={300}
        onEndReachedd={this.getPosts}
      />
    ) : this.renderBlankTiles();
  }
}

export default connectFeathers(FeedGridContainer, { withRef: true });
