import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Clipboard,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import update from 'react-addons-update';
import { ThreadCreateContainer } from 'AppContainers';
import { FeedItem, SettingsOverlay, SimpleTopNav } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { TextRegular } from 'AppFonts';
import {
  POST_VOTE_SERVICE,
  IMAGE_VOTE_SERVICE,
  HEATMAP_VOTE_SERVICE,
  FOLLOWER_SERVICE,
  GROUP_SERVICE,
} from 'AppServices';
import { AlertMessage } from 'AppUtilities';
import {
  FEED_USER_INFO_OVERLAY_WIDTH,
  FEED_USER_INFO_OVERLAY_HEIGHT,
  WINDOW_WIDTH,
  FEED_ITEM,
} from 'AppConstants';
import { GREEN, WHITE, GRAY } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  close: {
    height: 30,
    width: 30,
    tintColor: WHITE,
  },
  buttonBottom: {
    width: WINDOW_WIDTH,
    height: 70,
    backgroundColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: WHITE,
    fontSize: 30,
  }
});

class FeedItemContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    routeScene: PropTypes.func,
    voteImage: PropTypes.func,
    votePost: PropTypes.func,
    index: PropTypes.string,
    setActivePost: PropTypes.func.isRequired,
    refreshPost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    expireVoting: PropTypes.func.isRequired,
    routeToComments: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      translateX: new Animated.Value(0),
      followerCount: props.post.userDetails.followerCount,
      currentlyFollowing: props.post.userDetails.currentlyFollowing,
      refreshing: false,
      modalVisible: false,
    };
    this.getHeatmapVotes = ::this.getHeatmapVotes;
    this.votePost = ::this.votePost;
    this.voteImage = ::this.voteImage;
    this.handleMove = ::this.handleMove;
    this.handleRelease = ::this.handleRelease;
    this.setMove = ::this.setMove;
    this.animateInfoWindow = ::this.animateInfoWindow;
    this.resetOverlays = ::this.resetOverlays;
    this.messagePost = ::this.messagePost;
    this.messageUser = ::this.messageUser;
    this.followUser = ::this.followUser;
    this.sendPushNotification = ::this.sendPushNotification;
    this.getImageDims = ::this.getImageDims;
    this.copyLink = ::this.copyLink;
    this.panListener = null;
    this.translateX = null;
    this.feedItemRef = null;
    this.settingsOverlayShown = false;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.setMove,
      onPanResponderMove: this.handleMove,
      onPanResponderRelease: this.handleRelease,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true
    });
  }

  componentDidMount() {
    this.panListener = this.state.translateX.addListener(value => this.translateX = value);
  }

  componentWillUnmount() {
    this.state.translateX.removeListener(this.panListener);
  }

  getImageDims() {
    const { post } = this.props;
    const { height: imageHeight, width: imageWidth } = post.preview;
    const dimensions = {};
    const ratio = imageWidth / imageHeight; // AxB
    const validRatio = FEED_ITEM.WIDTH / FEED_ITEM.HEIGHT; // 3x4

    if (ratio > validRatio) {
      dimensions.width = FEED_ITEM.WIDTH;
      dimensions.height = dimensions.width / ratio;
    } else if (imageHeight < FEED_USER_INFO_OVERLAY_HEIGHT) {
      dimensions.height = FEED_USER_INFO_OVERLAY_HEIGHT;
      dimensions.width = dimensions.height * ratio;
    } else {
      // height is normal or tail
      dimensions.height = FEED_ITEM.HEIGHT;
      dimensions.width = dimensions.height * ratio;
    }
    return dimensions;
  }

  getHeatmapVotes() {
    const { post, feathers, index, voteImage } = this.props;
    feathers.service(HEATMAP_VOTE_SERVICE).get(post.images[0].id)
      .then(data => {
        voteImage(index, data, 'heatmapVotes');
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
      });
  }


  setMove(evt, gestureState) {
    if (gestureState.dx < 0) {
      this.props.setActivePost();
    }
    return !this.feedItemRef.overlayShown &&
    (!this.settingsOverlayShown && gestureState.dx > 0 ||
    (this.settingsOverlayShown && gestureState.dx < 0));
  }

  animateInfoWindow(failure) {
    let newValue = 0;
    if (!this.settingsOverlayShown) {
      newValue = failure ? 0 : FEED_USER_INFO_OVERLAY_WIDTH;
    } else {
      newValue = failure ? 0 : -FEED_USER_INFO_OVERLAY_WIDTH;
    }
    Animated.timing(this.state.translateX, {
      toValue: newValue,
      duration: 200,
    }).start(() => {
      this.state.translateX.setOffset(this.translateX.value);
      this.state.translateX.setValue(0);
      if (!failure) {
        this.settingsOverlayShown = !this.settingsOverlayShown;
      }
    });
  }

  handleMove(evt, gestureState) {
    if (
      !this.settingsOverlayShown && gestureState.dx < FEED_USER_INFO_OVERLAY_WIDTH ||
      this.settingsOverlayShown && gestureState.dx < 0
    ) {
      return Animated.event([null, {
        dx: this.state.translateX
      }])(evt, gestureState);
    }
    return null;
  }

  handleRelease(event, gestureState) {
    if (
      !this.settingsOverlayShown &&
      (gestureState.dx > FEED_USER_INFO_OVERLAY_WIDTH / 2 || gestureState.vx > 1) ||
      this.settingsOverlayShown &&
      (gestureState.dx < -FEED_USER_INFO_OVERLAY_WIDTH / 2 || gestureState.vx < -1)
    ) {
      return this.animateInfoWindow(false);
    }
    return this.animateInfoWindow(true);
  }

  voteImage(imageId, position, imageDimensions, screenDimensions, imageVoteDetails) {
    const { post, feathers, voteImage, index } = this.props;
    const voteSchema = {
      imageId,
      postId: post.id,
    };
    const service = post.heatmap ? HEATMAP_VOTE_SERVICE : IMAGE_VOTE_SERVICE;
    if (post.heatmap) {
      voteSchema.position = { x: position.left, y: position.top };
      voteSchema.imageDimensions = imageDimensions;
      voteSchema.screenDimensions = screenDimensions;
    }
    return feathers.service(service).create(voteSchema)
    .then(() => {
      if (post.heatmap) {
        this.getHeatmapVotes();
      } else if (voteImage) {
        voteImage(index, imageVoteDetails);
      }
    })
    .catch(error => {
      AlertMessage.fromRequest(error);
    });
  }

  votePost(postId, emojiId, votesByEmoji) {
    const { votePost, index, post } = this.props;
    this.props.feathers.service(POST_VOTE_SERVICE).create({ postId, emojiId })
    .then(() => {
      const votes = update(post.votes, {
        userVotes: { $set: { emojiId } },
        votesByEmoji: { $set: votesByEmoji },
      });
      return votePost && votePost(index, votes);
    })
    .catch(error => console.log(error));
  }

  messagePost() {

  }

  messageUser() {
    const { feathers, routeScene } = this.props;
    feathers.service(GROUP_SERVICE).find({ query: { groupMemberHash: [feathers.get('user').id] } })
    .then(result => {
      if (result.data.length > 0) {
        return routeScene('MessageScene', { thread: result.data[0] });
      }
    })
    .catch(error => AlertMessage.fromRequest(error));
  }

  followUser(followUserId) {
    const { feathers } = this.props;
    const { currentlyFollowing, followerCount } = this.state;
    const increment = currentlyFollowing ? -1 : 1;
    feathers.service(FOLLOWER_SERVICE).create({ followUserId })
    .then(() => this.setState({
      currentlyFollowing: !currentlyFollowing,
      followerCount: followerCount + increment,
    }));
  }

  sendPushNotification() {

  }

  copyLink(postId) {
    Clipboard.setString(`https://justhive.com/p/${postId}`);
  }

  resetOverlays() {
    if (this.settingsOverlayShown) {
      this.animateInfoWindow(false);
    }
    if (this.props.post.voted || this.props.post.voting) {
      this.feedItemRef.resetOverlays();
    }
  }

  render() {
    const {
      post,
      routeScene,
      refreshPost,
      deletePost,
      expireVoting,
      routeToComments
    } = this.props;
    const {
      translateX,
      currentlyFollowing,
      followerCount,
      refreshing,
      modalVisible,
    } = this.state;

    const { height, width } = this.getImageDims();

    const containerHeight = height < FEED_USER_INFO_OVERLAY_HEIGHT ?
      height :
      FEED_USER_INFO_OVERLAY_HEIGHT;

    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <FeedItem
          ref={ref => this.feedItemRef = ref}
          post={post}
          voted={post.voted}
          votedImage={post.votedImage}
          routeScene={routeScene}
          votePost={(emojiId, votesByEmoji) => this.votePost(post.id, emojiId, votesByEmoji)}
          voteImage={this.voteImage}
          heatmapVotes={post.heatmapVotes}
          isOpenSettingsOverlay={() => this.settingsOverlayShown}
          votes={post.votes}
          imageVoteDetails={post.imageVoteDetails}
          voteImageCount={post.votesImage}
          postVotes={post.totalVotes || 0}
          animateInfoWindow={this.animateInfoWindow}
          routeToComments={routeToComments}
          height={height}
          width={width}
        />
        <SettingsOverlay
          userDetails={post.userDetails}
          ago={post.ago}
          translateX={translateX}
          containerHeight={containerHeight}
          imageHeight={height}
          refreshPost={() => this.setState({ refreshing: true }, () => {
            refreshPost()
            .then(() => this.setState({ refreshing: false }));
          })}
          deletePost={deletePost}
          expireVoting={expireVoting}
          messagePost={() => this.messagePost(post.id)}
          messageUser={() => this.messageUser(post.createdBy.id)}
          followUser={() => this.followUser(post.createdBy.id)}
          sendPushNotification={() => this.setState({ modalVisible: true })}
          copyLink={() => this.copyLink(post.id)}
          currentlyFollowing={currentlyFollowing}
          followerCount={followerCount}
          refreshing={refreshing}
          routeScene={routeScene}
        />
        <Modal animationType="slide" visible={modalVisible}>
          <ThreadCreateContainer
            routeScene={() => null}
            routeBack={() => this.setState({ modalVisible: false })}
            customHeader={(
              <SimpleTopNav
                centerLabel="Select Users"
                sideFontSize={16}
                rightAction={() => this.setState({ modalVisible: false })}
                rightLabel={(
                  <Image source={require('img/icons/icon_cancel.png')} style={styles.close} />
                )}
                backgroundColor={GREEN}
              />
            )}
            customCompleteButton={(
              <TouchableOpacity
                style={styles.buttonBottom}
                onPress={this.sendPushNotification}
              >
                <TextRegular style={styles.buttonLabel}>Send Notifications</TextRegular>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </View>
    );
  }
}

export default connectFeathers(FeedItemContainer, { withRef: true });
