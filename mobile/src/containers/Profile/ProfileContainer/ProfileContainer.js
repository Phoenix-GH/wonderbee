import React, { Component, PropTypes } from 'react';
import {
  View,
  ScrollView,
  Animated,
  Image,
  RefreshControl,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import _ from 'lodash';
import { FeedContainer, FeedGridContainer, Feed360Container } from '../../';
import { connectFeathers } from 'AppConnectors';
import { ProfileInfo, ProfileTopNav, ProfilePostControl, MutualFollowersList, Loading } from 'AppComponents';
import { TextSemiBold, TextRegular } from 'AppFonts';
import { FOLLOWER_SERVICE, USER_SERVICE, POST_SERVICE, GROUP_SERVICE } from 'AppServices';
import { AlertMessage } from 'AppUtilities';
import { WHITE, GRAY, LIGHT_GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT, NAVBAR_HEIGHT, STATUSBAR_HEIGHT } from 'AppConstants';

import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WINDOW_WIDTH
  },
  center: {
    alignItems: 'center',
  },
  arrow: {
    top: 10,
    width: 1,
    flex: 1,
    backgroundColor: GRAY,
  },
  gray: {
    color: GRAY,
  },
  whiteBG: {
    backgroundColor: WHITE,
  },
  mutuals: {
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: WHITE,
  },
  settingsIcon: {
    width: 29,
    height: 7,
    tintColor: WHITE
  },
  bottomBackground: {
    position: 'absolute',
    bottom: -WINDOW_HEIGHT,
    left: 0,
    right: 0,
    top: 0
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statColumn: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statCount: {
    fontSize: 18
  },
  statLabel: {
    fontSize: 10
  },
  privateProfileText: {
    fontSize: 18
  },
  emptyProfileText: {
    fontSize: 18,
    paddingTop: 20
  },
  postAlert: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    backgroundColor: LIGHT_GRAY,
  },
  postAlertText: {
    fontSize: 16,
    paddingVertical: 5
  },
  row: {
    flexDirection: 'row'
  }
});

class ProfileContainer extends Component {

  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    userPass: PropTypes.any,
    activeScene: PropTypes.string,
  };

  static defaultProps = {
    userPass: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentUser: props.userPass || props.feathers.get('user'),
      currentlyFollowing: false,
      feedStyle: 'tile',
      postCount: 0,
      colonyCount: 0,
      followerCount: 0,
      followingCount: 0,
      needApproveCount: 0,
      loading: true,
      top: -100,
      bottom: new Animated.Value(-NAVBAR_HEIGHT),
      height: new Animated.Value(0),
      scale: new Animated.Value(0),
      left: new Animated.Value(0),
      dropDownActive: false,
      refreshing: false,
      feedRefreshing: false,
      loadingMutuals: true,
      listMutuals: [],
      scrollContentHeight: null,
    };
    this.isPostsLoaded = 0;
    this.feedGridRef = null;
    this.feedRef = null;
    this.getUserInfo = ::this.getUserInfo;
    this.setFeedStyle = ::this.setFeedStyle;
    this.followUser = ::this.followUser;
    this.routeMessage = ::this.routeMessage;
    this.renderTopNav = ::this.renderTopNav;
    this.renderStatsBar = ::this.renderStatsBar;
    this.renderFeed = ::this.renderFeed;
    this.renderBottomSide = ::this.renderBottomSide;
    this.renderPostAlert = ::this.renderPostAlert;
    this.onPostCreated = ::this.onPostCreated;
    this.onFollowCreated = ::this.onFollowCreated;
    this.onFollowPatched = ::this.onFollowPatched;
    this.onFollowRemoved = ::this.onFollowRemoved;
    this.onRefresh = ::this.onRefresh;
    this.onFeedRefreshDone = ::this.onFeedRefreshDone;
    this.onScrollContentSizeChange = ::this.onScrollContentSizeChange;
    this.onScroll = ::this.onScroll;
    this.on360View = ::this.on360View;
    this.showPostAlert = ::this.showPostAlert;
    this.hidePostAlert = ::this.hidePostAlert;
    this.render360Container = ::this.render360Container;
    this.addNeedApprove = ::this.addNeedApprove;
    this.alertTimeout = null;
    this.postAlertIsVisible = false;
  }

  componentWillMount() {
    const { feathers } = this.props;
    const postService = feathers.service(POST_SERVICE);
    const followerService = feathers.service(FOLLOWER_SERVICE);
    const userService = feathers.service(USER_SERVICE);

    postService.on('created', this.onPostCreated);
    followerService.on('created', this.onFollowCreated);
    followerService.on('patched', this.onFollowPatched);
    followerService.on('removed', this.onFollowRemoved);
    userService.on('patched', this.onRefresh);

    this.getUserInfo();
  }

  componentDidUpdate() {
    const { activeScene } = this.props;
    if (this.postAlertIsVisible && activeScene !== 'ProfileScene') {
      this.hidePostAlert();
    }
  }

  componentWillUnmount() {
    const { feathers } = this.props;
    const postService = feathers.service(POST_SERVICE);
    const followerService = feathers.service(FOLLOWER_SERVICE);
    const userService = feathers.service(USER_SERVICE);
    postService.off('created', this.onPostCreated);
    followerService.off('created', this.onFollowCreated);
    followerService.off('patched', this.onFollowPatched);
    followerService.off('removed', this.onFollowRemoved);
    userService.off('patched', this.onRefresh);
  }

  on360View(hide) {
    if (!this.state.postCount && !hide) return;

    Animated.timing(this.state.left, {
      toValue: hide ? 0 : -WINDOW_WIDTH,
      duration: 500
    }).start();
  }

  onRefresh(profile) {
    this.isPostsLoaded = 0;
    const { feathers } = this.props;
    const userId = feathers.get('user').id;
    if (!profile || userId === profile.id) {
      this.setState({
        refreshing: true,
        feedRefreshing: true
      }, () => this.getUserInfo());
    }
  }

  onFeedRefreshDone() {
    this.setState({ feedRefreshing: false });
  }

  onPostCreated(post) {
    if (_.toInteger(post.userId) === this.props.feathers.get('user').id) {
      this.setState({ postCount: this.state.postCount + 1 });
    }
  }

  onFollowCreated(follow) {
    const { userPass, feathers } = this.props;
    const { id } = userPass || feathers.get('user');
    const { followingCount, followerCount } = this.state;
    const isCurrentUser = !userPass || userPass.id === feathers.get('user').id;

    if (follow.following) {
      if (id === _.toInteger(follow.followUserId)) {
        this.setState({
          followerCount: followerCount + 1,
          currentlyFollowing: follow.following,
          needApproveCount: isCurrentUser ? this.addNeedApprove(follow, 1) : 0,
        });
      } else if (id === _.toInteger(follow.userId)) {
        this.setState({
          followingCount: followingCount + 1,
        });
      }
    }
  }

  onFollowPatched(follow) {
    const { id } = this.props.userPass || this.props.feathers.get('user');

    if (id === _.toInteger(follow.followUserId) && follow.approved) {
      this.setState({
        needApproveCount: this.state.needApproveCount - 1,
      });
    }
  }

  onFollowRemoved(follow) {
    const { userPass, feathers } = this.props;
    const { id } = userPass || feathers.get('user');
    const isCurrentUser = !userPass || userPass.id === feathers.get('user').id;

    if (id === _.toInteger(follow.followUserId)) {
      this.setState({
        followerCount: this.state.followerCount - 1,
        currentlyFollowing: follow.following,
        needApproveCount: isCurrentUser ? this.addNeedApprove(follow, -1) : 0,
      });
    } else if (id === _.toInteger(follow.userId)) {
      this.setState({
        followingCount: this.state.followingCount - 1,
      });
    }
  }

  onScroll(event) {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const maximumOffset = event.nativeEvent.contentSize.height - WINDOW_HEIGHT;
    if (currentOffset >= maximumOffset - 300) {
      const { feedStyle } = this.state;
      if (feedStyle === 'tile' && this.feedGridRef) {
        this.feedGridRef.getWrappedInstance().getPosts(true);
      } else if (feedStyle === 'list' && this.feedRef) {
        this.feedRef.getWrappedInstance().getPosts(true);
      }
    }
  }

  onScrollContentSizeChange(width, height) {
    const { feedStyle } = this.state;
    const isLoaded = feedStyle === 'tile' && this.isPostsLoaded;


    if (height < WINDOW_HEIGHT - NAVBAR_HEIGHT - STATUSBAR_HEIGHT && isLoaded) {
      this.setState({
        scrollContentHeight: WINDOW_HEIGHT - NAVBAR_HEIGHT - STATUSBAR_HEIGHT - 5,
      });
    }
    this.isPostsLoaded++;
  }

  getUserInfo() {
    const { feathers, userPass } = this.props;
    const userService = feathers.service(USER_SERVICE);
    const { id } = userPass || feathers.get('user');
    userService.get(id)
    .then(user =>
      this.setState({
        currentUser: user,
        colonyCount: user.colonyCount || 0,
        postCount: user.postCount,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        currentlyFollowing: user.currentlyFollowing,
        needApproveCount: user.needApproveCount,
        loading: false,
        refreshing: false,
        feedRefreshing: user.postCount !== 0,
        loadingMutuals: false,
        listMutuals: user.mutuals,
        scrollContentHeight: null,
      })
    )
    .catch((err) => {
      AlertMessage.fromRequest(err);
      this.setState({
        refreshing: false,
        feedRefreshing: false,
      });
    });
  }

  setFeedStyle(currentUser, feedStyle) {
    if (feedStyle === '360') {
      return this.on360View();
    }
    this.isPostsLoaded = 0;
    return this.setState({ feedStyle });
  }

  addNeedApprove(follow, count) {
    return follow.approved ? this.state.needApproveCount : this.state.needApproveCount + count;
  }

  followUser() {
    const { feathers, userPass } = this.props;
    const followerService = feathers.service(FOLLOWER_SERVICE);
    const newFollower = { followUserId: userPass.id };
    followerService.create(newFollower);
  }

  routeMessage() {
    const { feathers, routeScene } = this.props;
    feathers.service(GROUP_SERVICE).find({ query: { groupMemberHash: [this.state.currentUser] } })
      .then(result => {
        if (result.data.length > 0) {
          return routeScene('MessageScene', { thread: result.data[0] });
        }
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  showPostAlert() {
    if (!this.postAlertIsVisible) {
      clearTimeout(this.alertTimeout);
      this.postAlertIsVisible = true;
      this.alertTimeout = setTimeout(() => {
        Animated.spring(this.state.bottom, {
          toValue: 0,
          duration: 400
        }).start();
      }, 1200);
    }
  }

  hidePostAlert() {
    Animated.spring(this.state.bottom, {
      toValue: -NAVBAR_HEIGHT,
      duration: 10
    }).start();
    this.postAlertIsVisible = false;
  }

  renderTopNav(user, isCurrentUser) {
    const { routeScene, routeBack } = this.props;
    const { height, top, scale } = this.state;
    if (isCurrentUser) {
      return (
        <ProfileTopNav
          leftLabel={<View />}
          centerLabel={`@${user.username}`}
          rightAction={() => routeScene('SettingScene')}
          rightLabel={
            <Image
              source={require('img/icons/icon_option_menu.png')}
              style={ styles.settingsIcon }
            />
          }
          height={height}
          top={top}
          scale={scale}
        />
      );
    }
    return (
      <ProfileTopNav
        leftAction={routeBack}
        centerLabel={`@${user.username}`}
        leftIconAction={() => routeScene('MessageScene')}
        height={height}
        top={top}
        scale={scale}
      />
    );
  }

  renderFeed(currentUser) {
    const { routeScene } = this.props;
    const { feedStyle, feedRefreshing, postCount } = this.state;
    switch (feedStyle) {
      case 'tile':
        return (
          <FeedGridContainer
            handles={[currentUser.id]}
            routeToFeedItem={routeScene}
            refreshing={feedRefreshing}
            refreshDone={this.onFeedRefreshDone}
            postCount={postCount}
            ref={ref => this.feedGridRef = ref}
          />
        );
      case 'list':
        return (
          <View style={styles.whiteBG}>
            <FeedContainer
              handles={[currentUser.id]}
              routeScene={routeScene}
              refreshing={feedRefreshing}
              refreshDone={this.onFeedRefreshDone}
              requiresRefresh={false}
              hasLoader={false}
              hasTopFilterBar={false}
              ref={ref => this.feedRef = ref}
            />
          </View>
        );
      default:
        return null;
    }
  }

  render360Container(currentUser) {
    const { routeScene } = this.props;
    const { feedRefreshing } = this.state;
    return (
      <View style={styles.whiteBG}>
        <Feed360Container
          handles={[currentUser.id]}
          routeScene={routeScene}
          routeBack={() => this.on360View(true)}
          refreshing={feedRefreshing}
          refreshDone={this.onFeedRefreshDone}
          colonyName={`@${currentUser.username}`}
        />
      </View>
    );
  }

  renderBottomSide(postCount, currentUser, isCurrentUser, currentlyFollowing) {
    const isPrivate = currentUser.private && !currentlyFollowing && !isCurrentUser;
    if (postCount > 0 && !isPrivate) {
      return (<View style={[styles.whiteBG, styles.container]}>
        { this.renderFeed(currentUser) }
        </View>
      );
    }

    if (isPrivate) {
      setTimeout(() => {
        this.onFeedRefreshDone();
      }, 1500);
      return (
        <View style={styles.container}>
          <View style={styles.center }>
            <TextSemiBold upperCase={false} style={styles.privateProfileText}>
              This user is private.
            </TextSemiBold>
            <TextRegular upperCase={false} style={styles.privateProfileText}>
              Please follow them to view their profile.
            </TextRegular>
          </View>
        </View>
      );
    }

    if (!isCurrentUser) {
      return (
        <View style={[styles.container, styles.center]}>
          <TextRegular upperCase={false} style={styles.emptyProfileText}>
            This user has not created any posts yet.
          </TextRegular>
        </View>
      );
    }

    this.showPostAlert();
    return (
      <View style={[styles.container, styles.center]}>
        <TextRegular upperCase={false} style={[styles.emptyProfileText]}>
          Looks like there is nothing here.
        </TextRegular>
      </View>
    );
  }

  renderStatsBar(isCurrentUser) {
    const { routeScene } = this.props;
    const {
      currentUser,
      followerCount,
      followingCount,
      postCount,
      colonyCount,
    } = this.state;
    return (
      <View style={styles.statRow}>
        <TouchableOpacity style={styles.statColumn}>
          <TextSemiBold style={styles.statCount} >{postCount}</TextSemiBold>
          <TextRegular style={styles.statLabel} upperCase={true}>
            { postCount === 1 ? 'POST' : 'POSTS' }
          </TextRegular>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statColumn}
          onPress={() => (isCurrentUser ? routeScene('ColonyScene')
            : routeScene('ColonyScene', { user: currentUser }))}
        >
          <TextSemiBold style={styles.statCount} >{colonyCount}</TextSemiBold>
          <TextRegular style={styles.statLabel} upperCase={true}>
            { colonyCount === 1 ? 'COLONY' : 'COLONIES' }
          </TextRegular>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statColumn}
          onPress={() => routeScene('FollowerScene', { userId: currentUser.id, followers: true })}
        >
          <TextSemiBold style={styles.statCount} >{followerCount}</TextSemiBold>
          <TextRegular style={styles.statLabel} upperCase={true}>
            { followerCount === 1 ? 'FOLLOWER' : 'FOLLOWERS' }
          </TextRegular>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statColumn}
          onPress={() => routeScene('FollowerScene', { userId: currentUser.id, followers: false })}
        >
          <TextSemiBold style={styles.statCount} >{followingCount}</TextSemiBold>
          <TextRegular style={styles.statLabel} upperCase={true}>
            { followingCount === 1 ? 'FOLLOWING' : 'FOLLOWING' }
          </TextRegular>
        </TouchableOpacity>
      </View>
    );
  }

  renderPostAlert() {
    const { bottom } = this.state;
    return (
      <Animated.View style={[styles.postAlert, { bottom, height: NAVBAR_HEIGHT }]} >
        <TextSemiBold style={[styles.postAlertText]}>
          Tap here to JustHive
        </TextSemiBold>
        <View style={styles.arrow} />
        <TextSemiBold
          upperCase={false}
          style={[styles.gray, { backgroundColor: 'rgba(0, 0, 0, 0)' }]}
        >
          <Icon name="keyboard-arrow-down" size={25} />
        </TextSemiBold>
      </Animated.View>
    );
  }

  render() {
    const {
      feathers,
      userPass,
      routeScene,
    } = this.props;
    const {
      currentUser,
      currentlyFollowing,
      postCount,
      loading,
      refreshing,
      feedRefreshing,
      loadingMutuals,
      listMutuals,
      needApproveCount,
      left,
    } = this.state;
    const isCurrentUser = !userPass || userPass.id === feathers.get('user').id;
    if (loading) {
      return <Loading />;
    }
    const scrollStyle = (isCurrentUser && postCount === 0) ? { flex: 1 } : {};

    return (
      <Animated.View
        style={[
          { transform: [{ translateX: left }] },
          styles.row,
          styles.container,
        ]}
      >
        <View style={styles.container}>
          {this.renderTopNav(currentUser, !userPass || userPass.id === feathers.get('user').id)}
          {this.renderStatsBar(isCurrentUser)}
          <ScrollView
            onContentSizeChange={this.onScrollContentSizeChange}
            onScroll={this.onScroll}
            scrollEventThrottle={1}
            contentContainerStyle={scrollStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || feedRefreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <ProfileInfo
              currentUser={currentUser}
              isCurrentUser={isCurrentUser}
              currentlyFollowing={currentlyFollowing}
              follow={this.followUser}
              routeMessage={this.routeMessage}
              onAvatarPress={isCurrentUser ? () => routeScene('FollowersApproveScene') : undefined}
              badgeCount={needApproveCount}
            />
            {listMutuals && listMutuals.length > 0 && !isCurrentUser &&
            <MutualFollowersList
              isLoading={loadingMutuals}
              list={listMutuals}
              style={styles.mutuals}
              routeScene={routeScene}
            />}
            <ProfilePostControl
              setFeedStyle={(style) => this.setFeedStyle(currentUser, style)}
            />
            {!(isCurrentUser && postCount === 0) && <View>
              <View style={[styles.whiteBG, styles.bottomBackground]} />
            </View> }
            {this.renderBottomSide(postCount, currentUser, isCurrentUser, currentlyFollowing)}
          </ScrollView>
          {(isCurrentUser && postCount === 0) && this.renderPostAlert()}
        </View>
        {this.render360Container(currentUser)}
      </Animated.View>
    );
  }
}

export default connectFeathers(ProfileContainer);
