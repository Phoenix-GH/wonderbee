import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TextOverlayWrap } from 'AppComponents';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { CommentText, TextRegular } from 'AppFonts';
import {
  WINDOW_WIDTH,
  CLICK_DURATION,
  THUMB_SIZE,
} from 'AppConstants';
import { WHITE, BLUE, GRAY, LIGHT_GRAY } from 'AppColors';
import { VoteIcons } from './VoteIcons';
import { Heatmap } from './Heatmap';
import { VoteMultiImage } from './VoteMultiImage';
import { CommentCount } from './CommentCount';
import { findIndex } from 'lodash';

const HIT_SLOP = { top: 20, bottom: 40, left: 20, right: 20 };

const styles = StyleSheet.create({
  postCaption: {
    flexDirection: 'row',
    fontSize: 16,
    flexWrap: 'wrap'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  settingsIcon: {
    width: 20,
    resizeMode: 'contain',
    tintColor: GRAY,
    marginRight: 5,
  },
  locationPinIcon: {
    height: 25,
    width: 25,
    marginHorizontal: 5,
    resizeMode: 'contain',
    tintColor: GRAY,
  },
  imageContainer: {
    width: WINDOW_WIDTH,
    backgroundColor: '#000',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
    marginHorizontal: 15,
    paddingTop: 8,
    marginTop: 5,
  },
  whiteFeedback: {
    position: 'absolute',
    backgroundColor: WHITE,
  },
  message: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
  },
  beforeVote: {
    fontSize: 26,
    color: WHITE,
    flexWrap: 'wrap'
  },
});

export class FeedItem extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    votePost: PropTypes.func.isRequired,
    voteImage: PropTypes.func.isRequired,
    heatmapVotes: PropTypes.object,
    routeScene: PropTypes.func,
    isOpenSettingsOverlay: PropTypes.func.isRequired,
    voted: PropTypes.bool.isRequired,
    votedImage: PropTypes.bool.isRequired,
    votes: PropTypes.object.isRequired,
    imageVoteDetails: PropTypes.array.isRequired,
    voteImageCount: PropTypes.number.isRequired,
    postVotes: PropTypes.number.isRequired,
    animateInfoWindow: PropTypes.func.isRequired,
    routeToComments: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      messageLeft: new Animated.Value(-WINDOW_WIDTH),
      messageOpacity: new Animated.Value(0),
      leftOverlay: new Animated.Value(-WINDOW_WIDTH),
      scaleOverlay: new Animated.Value(0),
      emojiLeft: new Animated.Value(props.voted ? -WINDOW_WIDTH : 0),
      emojiTop: new Animated.Value(props.voted ? 200 : 0),
      opacity: new Animated.Value(1),
      selectedImageIndex: 0,
      touchLeft: 0,
      touchTop: 0,
      whiteFeedback: {},
      showFullComment: false,
    };

    this.voteImage = ::this.voteImage;
    this.votePost = :: this.votePost;
    this.showShareView = ::this.showShareView;
    this.getImageDataOnTouch = ::this.getImageDataOnTouch;
    this.animateOverlay = ::this.animateOverlay;
    this.handlePressIn = ::this.handlePressIn;
    this.handlePressOut = ::this.handlePressOut;
    this.clearTimeouts = ::this.clearTimeouts;
    this.renderWhiteImageOverlay = ::this.renderWhiteImageOverlay;
    this.renderEmojis = ::this.renderEmojis;
    this.renderVoting = ::this.renderVoting;
    this.renderMessage = ::this.renderMessage;
    this.animateMessageOverlay = ::this.animateMessageOverlay;
    this.animateEmojiOverlay = ::this.animateEmojiOverlay;
    this.handlePinch = ::this.handlePinch;
    this.resetOverlays = ::this.resetOverlays;
    this.voteGuages = null;
    this.animating = false;
    this.emojisShown = !props.voted && !props.post.voting && !props.post.isExpired;
    this.overlayShown = false;
    this.routed = false;
    this.pressTimeout = null;
    this.longPressTimeout = null;
    this.locationX = 0;
    this.locationY = 0;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.props.isOpenSettingsOverlay() && !this.animating,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePinch,
      onPanResponderGrant: this.handlePressIn,
      onPanResponderRelease: this.handlePressOut,
      onPanResponderTerminate: this.clearTimeouts,
    });
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  getImageDataOnTouch(post, left, top) {
    const { height, width } = this.props;
    const getImage = (order) => post.images.filter(img => img.order === order)[0];
    const imageNum = post.images.length;
    const { layout } = post;
    const loopThrough = (maxNum, touchDim, containerDim) => {
      let position = 1;
      for (let i = 1; i < maxNum; i++) {
        if (touchDim < containerDim / maxNum * i) {
          break;
        }
        position++;
      }
      return position;
    };
    if (imageNum === 1) {
      return {
        image: getImage(0),
        top: top - 15,
        left: left - 15,
        height: 30,
        width: 30,
        borderRadius: 15,
      };
    } else if (imageNum === 4 && layout === 'quad') {
      const dims = {
        height: height / 2,
        width: width / 2,
      };
      if (left < width / 2 && top < height / 2) {
        return {
          image: getImage(1),
          top: 0,
          left: 0,
          ...dims
        };
      }
      if (left >= width / 2 && top < height / 2) {
        return {
          image: getImage(2),
          top: 0,
          left: width / 2,
          ...dims,
        };
      }
      if (left < width / 2 && top >= height / 2) {
        return {
          image: getImage(3),
          top: height / 2,
          left: 0,
          ...dims,
        };
      }
      if (left >= width / 2 && top >= height / 2) {
        return {
          image: getImage(4),
          top: height / 2,
          left: width / 2,
          ...dims,
        };
      }
    }
    const container = layout === 'vertical' ? width : height;
    const touchDim = layout === 'vertical' ? left : top;
    const imgNumSelected = loopThrough(imageNum, touchDim, container);

    const imageDims = {
      height: layout === 'vertical' ? height : height / imageNum,
      width: layout === 'horizontal' ? width : width / imageNum,
    };
    return {
      image: getImage(imgNumSelected),
      top: layout === 'vertical' ? 0 : (imgNumSelected - 1) * height / imageNum,
      left: layout === 'horizontal' ? 0 : (imgNumSelected - 1) * width / imageNum,
      ...imageDims
    };
  }

  clearTimeouts() {
    if (this.pressTimeout) {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = null;
    }
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
  }

  votePost(emojiId) {
    const { votePost, voted, votes, postVotes, post } = this.props;
    if (!voted && !post.userDetails.isOwner) {
      const highest = {
        votes: 0,
        key: 0,
      };
      const votesByEmoji = votes.votesByEmoji.map((vote, i) => {
        let voteNum = parseInt(vote.voteCount, 10);
        if (vote.emojiId === emojiId.toString()) {
          voteNum++;
        }
        if (voteNum > highest.votes) {
          highest.votes = parseInt(vote.voteCount, 10);
          highest.key = i;
        }
        if (vote.emojiId === emojiId.toString()) {
          return {
            ...vote,
            voteCount: parseInt(vote.voteCount, 10) + 1,
            votePercent: (parseInt(vote.voteCount, 10) + 1) / (postVotes + 1),
            highest: false,
          };
        }
        return {
          ...vote,
          votePercent: parseInt(vote.voteCount, 10) / (postVotes + 1),
          highest: false,
        };
      });
      votesByEmoji[highest.key].highest = true;
      votePost(emojiId, votesByEmoji);
    }
  }

  animateOverlay(voted = false) {
    if (this.props.post.voting) {
      if (!this.overlayShown) {
        this.state.leftOverlay.setValue(0);
      }
      this.animating = true;
      Animated.timing(
        this.state.scaleOverlay, {
          toValue: this.overlayShown ? 0 : 1,
          duration: 200,
        }
      ).start(() => {
        this.overlayShown = !this.overlayShown;
        this.animating = false;
        if (!this.overlayShown) {
          this.state.leftOverlay.setValue(-WINDOW_WIDTH);
        }
        if (voted) {
          this.voteGuages.setVoteValue();
        }
      });
    } else {
      this.animateEmojiOverlay();
    }
  }

  animateEmojiOverlay() {
    if (!this.emojisShown) {
      this.state.emojiLeft.setValue(0);
    }
    Animated.timing(
      this.state.emojiTop, {
        toValue: this.emojisShown ? 200 : 0,
        duration: 200,
      }
    ).start(() => {
      this.emojisShown = !this.emojisShown;
      if (!this.emojisShown) {
        this.state.emojiLeft.setValue(-WINDOW_WIDTH);
      }
    });
  }

  animateMessageOverlay() {
    this.state.messageLeft.setValue(0);
    Animated.sequence([
      Animated.timing(
        this.state.messageOpacity, {
          toValue: 1,
          duration: 300,
        }
      ),
      Animated.delay(700),
      Animated.timing(
        this.state.messageOpacity, {
          toValue: 0,
          duration: 300,
        }
      )
    ]).start(() => {
      this.state.messageLeft.setValue(-WINDOW_WIDTH);
    });
  }

  animateFeedback() {
    const { post } = this.props;
    Animated.timing(
      this.state.opacity, {
        toValue: 0,
        duration: 500,
      }
    ).start(() => this.animateOverlay(post.images.length > 1));
  }

  handlePressIn(evt) {
    const { locationX, locationY } = evt.nativeEvent;
    const { routeScene, post, votedImage, voteImageCount } = this.props;
    this.routed = false;
    if (!this.overlayShown) {
      this.longPressTimeout = setTimeout(() => {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = null;
        this.routed = true;
        const { image } = this.getImageDataOnTouch(post, locationX, locationY);
        const images = post.images;
        routeScene('FeedItemModalScene', {
          images,
          votedImage,
          voteImageCount,
          pageIndex: findIndex(images, img => img.order === image.order)
        });
      }, 500);
    }
  }

  handlePinch(event, gestureState) {
    function center(touches) {
      const a = touches[0];
      const b = touches[1];
      return {
        x: (a.pageX + b.pageX) / 2,
        y: (a.pageY + b.pageY) / 2,
      };
    }
    if (gestureState.numberActiveTouches > 1) {
      const { post, votedImage, voteImageCount, routeScene } = this.props;
      const { images } = post;
      const { x: locationX, y: locationY } = center(event.nativeEvent.touches);
      const { image } = this.getImageDataOnTouch(post, locationX, locationY);
      this.clearTimeouts();
      routeScene('FeedItemModalScene', {
        images,
        votedImage,
        voteImageCount,
        pageIndex: findIndex(images, img => img.order === image.order)
      });
    }
  }

  handlePressOut(evt) {
    const { locationX, locationY } = evt.nativeEvent;
    const animateVotingOverlay = () => {
      if (this.props.post.images.length > 1) {
        return this.animateFeedback();
      }
      return this.animateOverlay();
    };
    if (this.routed) {
      return this.clearTimeouts();
    }

    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    if (!this.props.post.voting) {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = null;
      return this.animateOverlay();
    }

    if (this.overlayShown) {
      return animateVotingOverlay();
    }

    if (this.props.post.userDetails.isOwner) {
      return this.props.post.votesImage === 0 ?
        this.animateMessageOverlay() : animateVotingOverlay();
    }

    if (this.props.votedImage || this.props.post.isExpired) {
      if (this.props.post.images.length > 1) {
        return this.animateFeedback();
      }
      return this.animateOverlay();
    }

    if (
      this.pressTimeout &&
      (locationX - this.locationX < THUMB_SIZE &&
        locationY - this.locationY < THUMB_SIZE)
    ) {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = null;
      if (
        this.props.post.voting &&
        !this.props.votedImage &&
        !this.props.post.isExpired
      ) {
        return this.voteImage(this.locationX, this.locationY);
      }
    }

    this.pressTimeout = setTimeout(() => {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = null;
      this.animateMessageOverlay();
    }, CLICK_DURATION);

    this.locationX = locationX;
    this.locationY = locationY;

    return null;
  }

  voteImage(left, top) {
    const {
      post,
      voteImage,
      imageVoteDetails: tempDetails,
      voteImageCount,
      height,
      width
    } = this.props;
    const { image, ...whiteFeedback } = this.getImageDataOnTouch(post, left, top);
    const position = { left, top };
    const newState = {
      whiteFeedback,
    };
    if (post.images.length > 1) {
      const heighestVotes = { votes: 0, key: null };
      const imageVoteDetails = tempDetails.map((img, i) => {
        if (img.votes > heighestVotes.votes) {
          heighestVotes.votes = img.votes;
          heighestVotes.key = i;
        }
        if (img.order === image.order) {
          return {
            ...img,
            voted: true,
            votes: img.votes + 1,
            percentage: (img.votes + 1) / (voteImageCount + 1),
            highest: false,
          };
        }
        return {
          ...img,
          highest: false,
          percentage: img.votes / (voteImageCount + 1),
        };
      });
      if (heighestVotes.key) {
        imageVoteDetails[heighestVotes.key].highest = true;
      }
      return voteImage(
        image.id,
        position,
        { width: post.preview.width, height: post.preview.height },
        { width, height },
        imageVoteDetails
      )
      .then(() => this.setState(newState, this.animateFeedback));
    }
    this.setState(newState, this.animateFeedback);
    return voteImage(
      image.id,
      position,
      { width: post.preview.width, height: post.preview.height },
      { width, height },
    );
  }

  resetOverlays() {
    if (this.overlayShown || this.emojisShown) {
      this.animateOverlay();
    }
  }

  showShareView(showShareView) {
    this.setState({ showShareView });
  }

  renderWhiteImageOverlay() {
    const { whiteFeedback, opacity } = this.state;
    return (
      <Animated.View style={[styles.whiteFeedback, whiteFeedback, { opacity }]} />
    );
  }

  renderEmojis(height) {
    const { post, voted, votes } = this.props;
    const { emojiTop, emojiLeft } = this.state;
    if (!votes.votesByEmoji) {
      return null;
    }
    return (
      <VoteIcons
        votePost={this.votePost}
        voted={post.userDetails.isOwner || voted || post.isExpired}
        votes={votes}
        emojis={post.emojis}
        left={emojiLeft}
        translateY={emojiTop}
        imageHeight={height}
      />
    );
  }

  renderVoting(width, height) {
    const { heatmapVotes, post, imageVoteDetails } = this.props;
    const {
      scaleOverlay,
      leftOverlay,
    } = this.state;
    if (!imageVoteDetails) {
      return null;
    }
    if (post.images.length > 1) {
      return (
        <VoteMultiImage
          ref={ref => this.voteGuages = ref}
          width={width}
          height={height}
          layout={post.layout}
          imageLength={post.images.length}
          scale={scaleOverlay}
          left={leftOverlay}
          imageVoteDetails={imageVoteDetails}
        />
      );
    }
    if (!heatmapVotes) {
      return null;
    }
    const userVote = {};
    if (heatmapVotes && heatmapVotes.userHeatmapVote) {
      const { height: imageHeight, width: imageWidth } = post.preview;
      userVote.x = width / imageWidth * heatmapVotes.userHeatmapVote.x;
      userVote.y = height / imageHeight * heatmapVotes.userHeatmapVote.y;
    }
    return heatmapVotes.heatmap && (
      <Heatmap
        userHeatmapVote={userVote.x ? userVote : null}
        heatmap={heatmapVotes.heatmap}
        width={width}
        height={height}
        scale={scaleOverlay}
        left={leftOverlay}
      />
    );
  }

  renderMessage() {
    const { messageLeft, messageOpacity } = this.state;
    const message = this.props.post.userDetails.isOwner ?
      'No Votes Exists' :
      'Double-Tap to Vote!';
    return (
      <Animated.View
        style={[styles.message, {
          left: messageLeft,
          opacity: messageOpacity,
        }]}
      >
        <TextRegular style={styles.beforeVote}>
          {message}
        </TextRegular>
      </Animated.View>
    );
  }

  render() {
    const {
      post,
      routeScene,
      votedImage,
      voteImageCount,
      routeToComments,
      height,
      width,
    } = this.props;

    const { showFullComment } = this.state;
    return (
      <View>
        <View
          style={[styles.imageContainer]}
        >
          <Image
            style={[styles.image, { height, width }]}
            indicator={Progress.Circle}
            indicatorProps={{
              size: 80,
              thickness: 4,
              borderWidth: 0,
              color: BLUE,
            }}
            source={{ uri: post.preview.url }}
          >
            {post.images.length === 1 &&
              post.images[0].textOverlays &&
              post.images[0].textOverlays.length > 0 &&
              post.images[0].textOverlays.map((text, i) => (
                <TextOverlayWrap
                  key={i}
                  filterType={text.filterType}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: [
                      {
                        translateX:
                          (text.pan.x - text.size.width / 2) *
                          width / post.images[0].width +
                          (WINDOW_WIDTH - width) / 2
                      },
                      {
                        translateY:
                          (text.pan.y + text.size.height / 2) *
                          height / post.images[0].height
                      },
                      { scale: text.scale },
                      { rotate: text.rotate },
                    ]
                  }}
                >
                  {text.text}
                </TextOverlayWrap>
              ))
            }
            {post.voting && this.renderVoting(width, height)}
            {this.renderWhiteImageOverlay()}
            {post.voting && this.renderMessage()}
          </Image>
          <View
            style={{
              height,
              width,
              position: 'absolute',
              top: 0,
              left: WINDOW_WIDTH / 2 - width / 2
            }}
            {...this.panResponder.panHandlers}
          />
          {!post.voting && this.renderEmojis(height)}
        </View>
        <View style={styles.row}>
          <View style={styles.innerRow}>
            <TouchableOpacity onPress={() => this.props.animateInfoWindow(false)}>
              <Image
                source={require('img/icons/feed-settings/settings.png')}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
            {post.hasLocations && (
              <TouchableOpacity
                onPress={() => {
                  this.props.routeScene('FeedItemModalScene', {
                    images: post.images,
                    votedImage,
                    voteImageCount,
                    pageIndex: 1
                  });
                }}
                hitSlop={HIT_SLOP}
              >
                <Image
                  source={require('img/icons/icon_location.png')}
                  style={styles.locationPinIcon}
                />
              </TouchableOpacity>
            )}
            {post.hasPins && (
              <TouchableOpacity
                onPress={() => {
                  this.props.routeScene('FeedItemModalScene', {
                    images: post.images,
                    votedImage,
                    voteImageCount,
                    pageIndex: 1
                  });
                }}
                hitSlop={HIT_SLOP}
              >
                <Image
                  source={require('img/icons/feed-settings/pin.png')}
                  style={styles.locationPinIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={routeToComments}
            hitSlop={HIT_SLOP}
          >
            <CommentCount count={post.comments.total} />
          </TouchableOpacity>
        </View>
        <View style={styles.metaContainer}>
          <CommentText
            style={styles.postCaption}
            showMore={
              () => post.isTruncated &&
              !showFullComment &&
              this.setState({ showFullComment: !showFullComment })
            }
            routeScene={routeScene}
          >
            {showFullComment ? post.full : post.truncated}
          </CommentText>
        </View>
      </View>
    );
  }
}
