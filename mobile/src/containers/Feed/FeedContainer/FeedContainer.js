import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  InteractionManager,
  PanResponder,
  Animated,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { EmptyFeedContainer, FeedItemContainer } from 'AppContainers';
import { Loading, FeedHeader, FeedTopFilterBar, PostingLoaderBar } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { POST_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { WINDOW_WIDTH, STATUSBAR_HEIGHT } from 'AppConstants';
import { default as CommentContainer } from './CommentContainer';
import update from 'react-addons-update';
import { isEqual, findKey, cloneDeep, omit } from 'lodash';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});

const listViewTopDefault = 45 + STATUSBAR_HEIGHT;

class FeedContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func,
    routeBack: PropTypes.func,
    goToHive: PropTypes.func,
    refreshing: PropTypes.bool,
    refreshDone: PropTypes.func,
    singlePost: PropTypes.object,
    hasHeader: PropTypes.bool,
    requiresRefresh: PropTypes.bool,
    hashtags: PropTypes.array,
    handles: PropTypes.array,
    locations: PropTypes.array,
    hasComments: PropTypes.bool,
    scrollToTopRequired: PropTypes.bool,
    hasLoader: PropTypes.bool,
    newPostExpected: PropTypes.bool,
    hasTopFilterBar: PropTypes.bool,
  };

  static defaultProps = {
    refreshing: false,
    singlePost: null,
    hasHeader: true,
    requiresRefresh: true,
    hashtags: [],
    handles: [],
    locations: [],
    hasComments: true,
    hasLoader: true,
    hasTopFilterBar: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      initialRender: false,
      loading: true,
      $skip: 0,
      posts: new ListView.DataSource({
        sectionHeaderHasChanged: (s1, s2) => !isEqual(s1[0], s2[0]),
        rowHasChanged: (r1, r2) => !isEqual(r1, r2),
      }),
      hasPosts: false,
      refreshing: false,
      left: new Animated.Value(0),
      postBlob: [],
      activePost: {},
      nestLevel: 0,
      topFilterTop: new Animated.Value(0),
      listViewTop: new Animated.Value(props.hasTopFilterBar ? listViewTopDefault : 0),
      activeFilter: 'Following',
      newPostExpected: false,
    };
    this.posts = [];
    this.getPosts = ::this.getPosts;
    this.renderRow = ::this.renderRow;
    this.renderHeader = ::this.renderHeader;
    this.renderComments = ::this.renderComments;
    this.onRefresh = ::this.onRefresh;
    this.setMove = ::this.setMove;
    this.handleMove = ::this.handleMove;
    this.animateBack = ::this.animateBack;
    this.handleMoveEnd = ::this.handleMoveEnd;
    this.voteImage = ::this.voteImage;
    this.votePost = ::this.votePost;
    this.animateForward = ::this.animateForward;
    this.incrementCommentCount = ::this.incrementCommentCount;
    this.resetFeedScene = ::this.resetFeedScene;
    this.handleScroll = ::this.handleScroll;
    this.animateTopBar = ::this.animateTopBar;
    this.refreshPost = ::this.refreshPost;
    this.deletePost = ::this.deletePost;
    this.expireVoting = ::this.expireVoting;
    this.getPostPromise = null;
    this.listView = null;
    this.feedItem = null;
    this.commentRef = null;
    this.topBarShown = true;
    this.scrollTo = 0;
    this.topRowVoting = false;
  }

  componentWillMount() {
    const postService = this.props.feathers.service(POST_SERVICE);
    postService.on('created', () =>
      this.setState({ refreshing: true },
      () => this.onRefresh(false))
    );
    this.listViewResponder = PanResponder.create({
      // eslint-disable-next-line max-len
      onMoveShouldSetPanResponder: this.setMove,
      onPanResponderMove: this.handleMove,
      onPanResponderRelease: this.handleMoveEnd,
      onPanResponderTerminate: this.handleMoveEnd,
    });
    this.scrollResponder = PanResponder.create({
      // eslint-disable-next-line max-len
      onStartShouldSetPanResponderCapture: e => this.props.singlePost === null && e.nativeEvent.pageY < 10,
      onPanResponderRelease: () => this.listView.scrollTo({ y: 0 }),
    });
    if (this.props.scrollToTopRequired) {
      this.listView.scrollTo({ y: 0 });
    }
    InteractionManager.runAfterInteractions(() => this.getPosts());
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.refreshing && !!newProps.refreshing) {
      this.onRefresh();
    }
    if (newProps.singlePost) {
      this.getPosts();
    }
    if (newProps.resetFeed) {
      this.resetFeedScene(true);
    }
    if (newProps.newPostExpected) {
      this.setState({ newPostExpected: true });
    }
  }

  componentWillUnmount() {
    this.props.feathers.service(POST_SERVICE).off('created', () =>
      this.setState({ initialRender: false, refreshing: true },
      () => this.onRefresh(false))
    );
    if (this.getPostPromise) {
      this.getPostPromise.cancel();
    }
  }

  resetFeedScene(needScroll = false) {
    if (this.state.initialRender && this.commentRef) {
      this.animateBack();
    }
    if (needScroll && this.listView) {
      this.listView.scrollTo({ y: 0 });
    }
  }

  onRefresh(setState = true) {
    if (setState) {
      this.setState({
        refreshing: true,
      }, () => this.getPosts());
    }
    this.getPosts();
  }

  getPosts(loadMore) {
    const { feathers, handles, hashtags, locations, singlePost } = this.props;
    const { $skip, loading, refreshing } = this.state;
    if (loading && loadMore) {
      return;
    }
    if (!loading && !refreshing) {
      this.setState({ loading: true });
    }
    const postService = feathers.service(POST_SERVICE);
    const query = { $skip: refreshing ? 0 : $skip };
    if (handles.length > 0) {
      query.userId = { $in: handles };
    }
    if (hashtags.length > 0) {
      query.hashtags = { $in: hashtags };
    }
    if (locations.length > 0) {
      query.locations = { $in: locations };
    }
    const alwaysSet = {
      initialRender: true,
      loading: false,
      refreshing: false,
      newPostExpected: false,
    };
    const parentRefreshCallback = () => {
      if (this.props.refreshing && !!this.props.refreshDone) {
        this.props.refreshDone();
      }
    };
    if (singlePost) {
      this.setState({
        ...alwaysSet,
        postBlob: { 0: [singlePost] },
        posts: this.state.posts.cloneWithRowsAndSections({ 0: [singlePost] }),
        hasPosts: true,
        activePost: singlePost
      });
    } else {
      this.getPostPromise = makeCancelable(postService.find({ query }));
      this.getPostPromise
      .promise
      .then(posts => {
        if (posts.data.length > 0) {
          this.posts = refreshing ? posts.data : this.posts.concat(posts.data);
          const postBlob = {};
          this.posts.forEach((post, i) => {
            postBlob[i] = [post];
          });
          this.setState({
            ...alwaysSet,
            postBlob,
            activePost: cloneDeep(this.posts[0]),
            posts: this.state.posts.cloneWithRowsAndSections(postBlob),
            $skip: refreshing ? posts.limit : $skip + posts.limit,
            hasPosts: posts.total > 0,
          }, parentRefreshCallback);
        } else {
          this.setState(alwaysSet, parentRefreshCallback);
        }
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
        this.setState({
          refreshing: false,
        });
      });
    }
  }

  handleScroll({ nativeEvent }) {
    if (nativeEvent.contentOffset.y > 0 && this.props.hasTopFilterBar) {
      if (!this.topBarShown && nativeEvent.contentOffset.y - this.scrollTo < -500) {
        this.animateTopBar();
        this.scrollTo = nativeEvent.contentOffset.y;
      } else if (this.topBarShown && nativeEvent.contentOffset.y - this.scrollTo > 1) {
        this.animateTopBar();
        this.scrollTo = nativeEvent.contentOffset.y;
      } else if (
        !this.topBarShown && nativeEvent.contentOffset.y - this.scrollTo >= 0 ||
        this.topBarShown && nativeEvent.contentOffset.y - this.scrollTo < 0
      ) {
        this.scrollTo = nativeEvent.contentOffset.y;
      }
    } else if (nativeEvent.contentOffset.y < 1 && this.props.hasTopFilterBar) {
      if (!this.topBarShown) {
        this.animateTopBar();
      }
    }
  }

  animateTopBar() {
    this.topBarShown = !this.topBarShown;
    Animated.parallel([
      Animated.timing(
        this.state.topFilterTop, {
          toValue: !this.topBarShown ? -40 : 0,
          duration: 300,
        }
      ),
      Animated.timing(
        this.state.listViewTop, {
          toValue: !this.topBarShown ? 0 : listViewTopDefault,
          duration: 300,
        }
      )
    ]).start();
  }

  setMove(evt, gestureState) {
    const { hasComments } = this.props;
    return gestureState.dx < -30 && hasComments && !this.state.refreshing;
  }

  handleMove(evt, gestureState) {
    return gestureState.dx < 0 && Animated.event([null, {
      dx: this.state.left,
    }])(evt, { ...gestureState, dx: gestureState.dx - 30 });
  }

  handleMoveEnd(evt, gestureState) {
    if (gestureState.dx < -WINDOW_WIDTH / 2 || gestureState.vx < -1.0) {
      this.animateForward();
    } else {
      this.animateBack();
    }
  }

  animateForward(n = 1) {
    return new Promise(resolve =>
      Animated.timing(
        this.state.left, {
          toValue: -WINDOW_WIDTH * n,
          duration: 200,
        }
      ).start(() => {
        resolve(null);
      })
    );
  }

  animateBack(n = 0) {
    return new Promise(resolve =>
      Animated.timing(
        this.state.left, {
          toValue: -WINDOW_WIDTH * n,
          duration: 200,
        }
      ).start(() => {
        resolve(null);
      })
    );
  }

  incrementCommentCount(postId, increment = 1) {
    const index = findKey(this.state.postBlob, post => post[0].id === postId);
    const postBlob = update(this.state.postBlob, {
      [index]: { 0: { comments: { total: { $apply: x => x + increment } } } }
    });
    this.setState({
      postBlob,
      posts: this.state.posts.cloneWithRowsAndSections(postBlob),
    });
  }

  voteImage(index, imageVoteDetails, key = 'imageVoteDetails') {
    const postBlob = update(this.state.postBlob, {
      [index]: { 0: {
        votedImage: { $set: true },
        voted: { $set: true },
        votesImage: { $apply: x => x + 1 },
        [key]: { $set: imageVoteDetails },
      } },
    });
    this.setState({
      postBlob,
      posts: this.state.posts.cloneWithRowsAndSections(postBlob),
    });
  }

  votePost(index, votes) {
    const postBlob = update(this.state.postBlob, {
      [index]: { 0: {
        voted: { $set: true },
        totalVotes: { $apply: x => x + 1 },
        votes: { $set: votes },
      } },
    });
    this.setState({
      postBlob,
      posts: this.state.posts.cloneWithRowsAndSections(postBlob),
    });
  }

  refreshPost(postId, index) {
    const { feathers } = this.props;
    const postIndex = index || findKey(this.state.postBlob, post => post[0].id === postId);
    return feathers.service(POST_SERVICE).find({ query: { id: postId } })
    .then(post => {
      const postBlob = update(this.state.postBlob, {
        [postIndex]: { 0: { $set: post.data[0] } }
      });
      this.setState({
        postBlob,
        posts: this.state.posts.cloneWithRowsAndSections(postBlob),
      });
    })
    .catch(error => console.log(error));
  }

  deletePost(postId, index) {
    const { feathers } = this.props;
    Alert.alert('Do you want to delete this post?', null, [
      { text: 'Cancel', onPress: () => null },
      { text: 'Confirm', onPress: () => {
        feathers.service(POST_SERVICE).remove(postId)
        .then(() => {
          const postBlob = omit(this.state.postBlob, index);
          this.setState({
            postBlob,
            posts: this.state.posts.cloneWithRowsAndSections(postBlob),
          });
        });
      } },
    ]);
  }

  expireVoting(postId, index) {
    const { feathers } = this.props;
    Alert.alert('Do you want to expire voting on this post?', null, [
      { text: 'Cancel', onPress: () => null },
      { text: 'Confirm', onPress: () => {
        feathers.service(POST_SERVICE).patch(postId, { requestType: 'expire' })
        .then(() => {
          const postBlob = update(this.state.postBlob, {
            [index]: { 0: { isExpired: { $set: true } } }
          });
          this.setState({
            postBlob,
            posts: this.state.posts.cloneWithRowsAndSections(postBlob),
          });
        });
      } }
    ]);
  }

  renderHeader(sectionData, sectionID) {
    const { routeScene, hasHeader, singlePost, routeBack } = this.props;
    const { postBlob } = this.state;
    const post = sectionData[0];
    if (!hasHeader) {
      return null;
    }
    const voted = postBlob[sectionID][0].voting ?
      postBlob[sectionID][0].votedImage :
      postBlob[sectionID][0].voted;
    const voteCount = postBlob[sectionID][0].voting ?
      postBlob[sectionID][0].votesImage :
      postBlob[sectionID][0].totalVotes;
    return (
      <FeedHeader
        key={post.id}
        routeScene={routeScene}
        post={post}
        voted={voted}
        votes={voteCount}
        routeBack={routeBack}
        hasBack={!!singlePost}
        setActivePost={() => this.setState({ activePost: post })}
      />
    );
  }

  renderComments() {
    const { activePost } = this.state;
    const { comments } = activePost;
    return (
      <CommentContainer
        ref={ref => this.commentRef = ref}
        comments={comments.data}
        commentCount={comments.total}
        routeBack={this.animateBack}
        handleMove={this.handleMove}
        animateForward={this.animateForward}
        activePost={activePost}
        parentId={null}
        routeScene={this.props.routeScene}
        incrementCommentCount={(increment) => this.incrementCommentCount(activePost.id, increment)}
        refreshPost={() => this.refreshPost(activePost.id)}
      />
    );
  }

  renderRow(post, index) {
    return (
      <FeedItemContainer
        ref={ref => this[`feedItem${index}`] = ref}
        key={post.id}
        post={post}
        routeScene={this.props.routeScene}
        voteImage={this.voteImage}
        votePost={this.votePost}
        index={index}
        setActivePost={() => this.setState({ activePost: post })}
        refreshPost={() => this.refreshPost(post.id, index)}
        deletePost={() => this.deletePost(post.id, index)}
        expireVoting={() => this.expireVoting(post.id, index)}
        routeToComments={() => this.setState({ activePost: post }, () => this.animateForward())}
      />
    );
  }

  render() {
    const {
      singlePost,
      requiresRefresh,
      hasComments,
      hasLoader,
      hasTopFilterBar,
    } = this.props;

    const {
      initialRender,
      loading,
      posts,
      hasPosts,
      refreshing,
      left,
      topFilterTop,
      listViewTop,
      activeFilter,
      newPostExpected
    } = this.state;

    if (initialRender && !hasPosts) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing && !this.props.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <EmptyFeedContainer goToHive={this.props.goToHive} />
        </ScrollView>
      );
    }
    return (
      <Animated.View
        style={[styles.wrap, { transform: [{ translateX: left }] }]}
        {...this.scrollResponder.panHandlers}
      >
        {hasTopFilterBar && (
          <FeedTopFilterBar
            translateY={topFilterTop}
            activeFilter={activeFilter}
          />
        )}
        {initialRender &&
          <View
            ref={ref => this.feedItem = ref}
            style={styles.wrap}
          >
            {newPostExpected && (
              <PostingLoaderBar />
            )}
            <Animated.View
              style={[styles.wrap, { transform: [{ translateY: listViewTop }] }]}
              {...this.listViewResponder.panHandlers}
            >
              <ListView
                ref={ref => this.listView = ref}
                dataSource={posts}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderHeader}
                onEndReachedThreshold={2000}
                pageSize={10}
                onScroll={this.handleScroll}
                onEndReached={this.getPosts}
                enableEmptySections={true}
                onChangeVisibleRows={(visibile, changed) => {
                  let lowestKey = null;
                  Object.keys(visibile).forEach((key, i) => {
                    if (i === 0) {
                      lowestKey = key;
                    } else if (key < lowestKey) {
                      lowestKey = key;
                    }
                  });
                  const notVisibleRows = Object.keys(changed).filter(key => !changed[key][0]);
                  if (notVisibleRows.length > 0) {
                    notVisibleRows.forEach(row => {
                      this[`feedItem${row}`].getWrappedInstance().resetOverlays();
                    });
                  }
                  if (this.state.postBlob[lowestKey]) {
                    this.topRowVoting = this.state.postBlob[lowestKey][0].voting;
                  }
                }}
                refreshControl={requiresRefresh && !singlePost ? (
                  <RefreshControl
                    refreshing={refreshing && !this.props.refreshing}
                    onRefresh={this.onRefresh}
                  />
                ) : null}
              />
            </Animated.View>
            {hasComments && (
              this.renderComments()
            )}
            {singlePost && <View style={{ height: 70 }} />}
          </View>
        }
        {loading &&
          !refreshing &&
          !singlePost &&
          hasLoader &&
          <Loading style={[!initialRender && { top: 70 }]} />
        }
      </Animated.View>
    );
  }
}

export default connectFeathers(FeedContainer, { withRef: true });
