import React, { PropTypes, Component } from 'react';
import {
  PanResponder,
  View,
  ListView,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import {
  SimpleTopNav,
  Comment,
  SendRow,
  Loading,
  KeyboardSpacing,
  DropdownBar,
} from 'AppComponents';
import { TextBold } from 'AppFonts';
import { dismissKeyboard, makeCancelable, AlertMessage } from 'AppUtilities';
import { connectFeathers } from 'AppConnectors';
import { cloneDeep, isEqual } from 'lodash';
import { COMMENT_SERVICE, COMMENT_VOTE_SERVICE } from 'AppServices';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { WHITE, BLUE, LIGHT_GRAY, YELLOW } from 'AppColors';

const sortButtons = [
  { label: 'Newest to Oldest', type: 'Newest' },
  { label: 'Oldest to Newest', type: 'Oldest' },
  // { label: 'Most Controversial', type: 'Most Controversial' },
  { label: 'Popular Users', type: 'Popular User' },
  { label: 'Highest Rated', type: 'Highest Rated' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 70,
  },
  topBar: {
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentFeed: {
    flex: 1,
    backgroundColor: WHITE,
  },
  commentView: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top: 0,
    left: WINDOW_WIDTH,
  },
  settingsIcon: {
    height: 20,
    width: 32,
    tintColor: WHITE,
  },
  homeIcon: {
    height: 20,
    width: 21.7,
  },
  sortText: {
    fontSize: 12,
    color: WHITE,
    backgroundColor: 'transparent',
  },
  downIcon: {
    height: 8,
    width: 13.8,
    marginLeft: 5,
  },
  chainContainer: {
    borderColor: LIGHT_GRAY,
    borderTopWidth: 1,
    alignItems: 'center'
  },
  chain: {
    height: 20,
    width: 20,
    top: -10,
    marginBottom: -10,
  }
});

class CommentContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    commentCount: PropTypes.number.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    handleMove: PropTypes.func.isRequired,
    animateForward: PropTypes.func.isRequired,
    activePost: PropTypes.object.isRequired,
    mainComment: PropTypes.object,
    parentId: PropTypes.number,
    localNestLevel: PropTypes.number.isRequired,
    parentComments: PropTypes.array,
    incrementCommentCount: PropTypes.func,
    incrementReplyCount: PropTypes.func,
    refreshPost: PropTypes.func,
  };

  static defaultProps = {
    localNestLevel: 1,
    parentComments: [],
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      nested: {},
      renderNested: false,
      comments: new ListView.DataSource({
        rowHasChanged: (r1, r2) => !isEqual(r1, r2),
      }),
      barY: new Animated.Value(0),
      barScaleY: new Animated.Value(0),
      commentCount: props.commentCount,
      $skip: 0,
      sortByActive: false,
      refreshing: false,
      loading: false,
      mainComment: null,
      activeSortBy: 'Newest',
      chainShown: false
    };
    this.renderRow = ::this.renderRow;
    this.cloneCommentRows = ::this.cloneCommentRows;
    this.handleMove = ::this.handleMove;
    this.handleEnd = ::this.handleEnd;
    this.insertMessage = ::this.insertMessage;
    this.setSortBy = ::this.setSortBy;
    this.commentVote = ::this.commentVote;
    this.toggleSortBy = ::this.toggleSortBy;
    this.getComments = ::this.getComments;
    this.getNestedComments = ::this.getNestedComments;
    this.animateForward = ::this.animateForward;
    this.deleteComment = ::this.deleteComment;
    this.incrementReplyCount = ::this.incrementReplyCount;
    this.barActive = false;
    this.currentTop = 0;
    this.comments = [];
    this.commentFind = null;
    this.nestedFind = null;
    this.panResonder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, g) => g.dx > 0 && !this.state.sortByActive,
      onPanResponderMove: this.handleMove,
      onPanResponderRelease: this.handleEnd,
      onPanResponderTerminate: this.handleEnd,
    });
  }

  componentWillMount() {
    this.cloneCommentRows(this.props.comments, this.props.commentCount);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePost.id !== this.props.activePost.id) {
      this.cloneCommentRows(nextProps.comments, nextProps.commentCount);
    }
  }

  componentWillUnmount() {
    if (this.commentFind) {
      this.commentFind.cancel();
    }
    if (this.nestedFind) {
      this.nestedFind.cancel();
    }
  }

  setSortBy(activeSortBy) {
    if (activeSortBy !== this.state.activeSortBy) {
      this.setState({ activeSortBy }, () => {
        this.toggleSortBy();
        if (this.state.commentCount > 1) {
          this.getComments();
        }
      });
    } else {
      this.toggleSortBy();
    }
  }

  getComments(freshSkip = true) {
    const { activeSortBy, $skip } = this.state;
    const { feathers, activePost, parentId } = this.props;
    const query = {
      sortBy: activeSortBy,
      postId: activePost.id,
      parentId,
      $skip: freshSkip ? 0 : $skip,
    };
    this.commentFind = makeCancelable(feathers.service(COMMENT_SERVICE).find({ query }));
    this.commentFind.promise
    .then(comments => this.cloneCommentRows(comments.data, comments.total, comments.skip));
  }

  getNestedComments(commentId) {
    this.nestedFind = makeCancelable(
      this.props.feathers.service(COMMENT_SERVICE).find({ query: { parentId: commentId } })
    );
    return this.nestedFind.promise
    .then(nested => {
      this.nested = cloneDeep(nested.data);
      this.setState({
        nested,
        renderNested: false,
      });
    })
    .catch(error => console.log(error));
  }

  insertMessage(text) {
    const { id: postId } = this.props.activePost;
    const { parentId, incrementCommentCount, localNestLevel } = this.props;
    const { commentCount } = this.state;
    const comment = {
      comment: text,
      postId,
      parentId,
    };
    this.props.feathers.service(COMMENT_SERVICE).create(comment)
    .then(newComment => {
      this.comments = [newComment].concat(this.comments);
      this.setState({
        comments: this.state.comments.cloneWithRows(this.comments),
        commentCount: commentCount + 1,
      });
      incrementCommentCount();
      if (localNestLevel > 1) {
        this.props.incrementReplyCount();
      }
    })
    .catch(error => {
      AlertMessage.fromRequest(error);
    });
  }

  cloneCommentRows(comments, commentCount, $skip) {
    this.comments = cloneDeep(comments);
    this.setState({
      comments: this.state.comments.cloneWithRows(comments),
      commentCount,
      renderNested: false,
      $skip: $skip > 0 ? this.state.$skip + $skip : 0,
      refreshing: false,
      loading: false,
    });
  }

  commentVote(type, commentId) {
    const vote = {
      commentId,
      value: type === 'upvote' ? 1 : -1,
    };
    this.props.feathers.service(COMMENT_VOTE_SERVICE).create(vote)
    .then(() => {
      this.comments = this.comments.map(comment => {
        if (comment.id === commentId) {
          if (type === 'upvote') {
            return { ...comment, upvoted: true, upvotes: comment.upvotes + 1 };
          }
          return { ...comment, downvoted: true, downvotes: comment.downvotes + 1 };
        }
        return comment;
      });
      this.setState({
        comments: this.state.comments.cloneWithRows(this.comments),
        commentCount: this.state.commentCount + 1,
      });
    })
    .catch(error => AlertMessage.fromRequest(error));
  }

  handleMove(event, gestureState) {
    this.props.handleMove(
      event,
      { ...gestureState, dx: gestureState.dx - WINDOW_WIDTH }
    );
  }

  handleEnd(event, gestureState) {
    const { localNestLevel } = this.props;
    if (gestureState.dx > WINDOW_WIDTH / 2 || gestureState.vx > 0.5) {
      dismissKeyboard();
      this.props.routeBack(localNestLevel - 1);
    } else {
      this.animateForward(localNestLevel);
    }
  }

  animateForward(n) {
    const { localNestLevel } = this.props;
    this.props.animateForward(n)
    .then(() => {
      if (n > localNestLevel) {
        dismissKeyboard();
      }
    });
  }

  incrementReplyCount(commentId) {
    const { mainComment } = this.state;
    this.comments = this.comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, commentCount: comment.commentCount + 1 };
      }
      return comment;
    });
    this.setState({
      comments: this.state.comments.cloneWithRows(this.comments),
      mainComment: { ...mainComment, commentCount: mainComment.commentCount + 1 },
    });
  }

  deleteComment(commentId) {
    const { feathers, incrementCommentCount } = this.props;
    Alert.alert('Do you want to delete this comment?', null, [
      { text: 'Cancel', onPress: () => null },
      { text: 'Confirm', onPress: () => {
        feathers.service(COMMENT_SERVICE).remove(commentId)
        .then(() => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
          this.setState({
            comments: this.state.comments.cloneWithRows(this.comments),
          });
          incrementCommentCount(-1);
          this.props.refreshPost();
        });
      } },
    ]);
  }

  toggleSortBy() {
    const animateSortBy = (sortByActive) => (
      Animated.parallel([
        Animated.timing(
          this.state.barY, {
            toValue: sortByActive ? 100 : 0,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.barScaleY, {
            toValue: sortByActive ? 1 : 0,
            duration: 200,
          }
        ),
      ]).start(() => {
        if (!sortByActive) {
          this.setState({ sortByActive });
        }
      })
    );
    if (this.state.sortByActive) {
      return animateSortBy(false);
    }
    return this.setState({ sortByActive: true }, () => (
      animateSortBy(true)
    ));
  }

  renderRow(comment) {
    const { localNestLevel, routeScene } = this.props;
    return (
      <Comment
        comment={comment}
        commentVote={(type) => this.commentVote(type, comment.id)}
        routeScene={routeScene}
        deleteComment={this.deleteComment}
        routeNestedComment={() => {
          this.getNestedComments(comment.id)
          .then(() => {
            this.setState({
              mainComment: comment,
              renderNested: true,
            }, this.animateForward(localNestLevel + 1));
          });
        }}
      />
    );
  }

  renderCenterLabel() {
    const { localNestLevel } = this.props;
    const { activeSortBy, chainShown, sortByActive } = this.state;
    if (localNestLevel === 1) {
      return (
        <TouchableOpacity onPress={this.toggleSortBy} style={styles.row}>
          <TextBold style={[styles.sortText, sortByActive && { color: YELLOW }]}>
            {activeSortBy}
          </TextBold>
          <Image
            source={require('img/icons/comment/icon_comment_down_arrow.png')}
            style={[
              styles.downIcon,
              sortByActive && { tintColor: YELLOW, transform: [{ rotate: '180deg' }] }
            ]}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => localNestLevel > 2 && this.setState({ chainShown: !chainShown })}
        style={styles.row}
      >
        <TextBold style={[styles.sortText, chainShown && { color: YELLOW }]}>
          Reply Chain - {localNestLevel - 1}
        </TextBold>
        {localNestLevel > 2 &&
          <Image
            source={require('img/icons/comment/icon_comment_down_arrow.png')}
            style={[
              styles.downIcon,
              chainShown && { tintColor: YELLOW, transform: [{ rotate: '180deg' }] }
            ]}
          />
        }
      </TouchableOpacity>
    );
  }

  renderRightLabel(goBack) {
    const { localNestLevel, routeBack } = this.props;
    if (localNestLevel === 1) {
      // return (
      //   <TouchableOpacity onPress={() => null}>
      //     <Image
      //       source={require('img/icons/comment/icon_comment_settings.png')}
      //       style={styles.settingsIcon}
      //     />
      //   </TouchableOpacity>
      // );
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => goBack(1)}
      >
        <Image
          source={require('img/icons/comment/icon_comment_home.png')}
          style={styles.homeIcon}
        />
      </TouchableOpacity>
    );
  }

  renderNestedComment() {
    const { nested } = this.state;
    const {
      feathers,
      routeBack,
      localNestLevel,
      animateForward,
      parentComments,
      mainComment,
      routeScene,
    } = this.props;
    return (
      <CommentContainer
        feathers={feathers}
        comments={nested.data.filter(nest =>
          nest.parentId === this.state.mainComment.id.toString()
        )}
        commentCount={nested.total}
        routeScene={routeScene}
        routeBack={routeBack}
        animateForward={animateForward}
        handleMove={this.handleMove}
        activePost={this.props.activePost}
        localNestLevel={localNestLevel + 1}
        mainComment={this.state.mainComment}
        parentId={this.state.mainComment.id}
        incrementCommentCount={this.props.incrementCommentCount}
        incrementReplyCount={() => this.incrementReplyCount(this.state.mainComment.id)}
        parentComments={cloneDeep(parentComments.concat(cloneDeep(mainComment)))}
        refreshPost={this.props.refreshPost}
      />
    );
  }

  render() {
    const {
      comments,
      refreshing,
      renderNested,
      sortByActive,
      barY,
      barScaleY,
      loading,
      chainShown,
    } = this.state;

    const {
      mainComment,
      localNestLevel,
      parentComments,
      routeScene,
    } = this.props;

    const goBack = (i) => {
      dismissKeyboard();
      this.props.routeBack(i);
    };
    return (
      <View style={[styles.container, styles.commentView]}>
        <Animated.View
          style={styles.container}
          {...this.panResonder.panHandlers}
        >
          <SimpleTopNav
            iconBack={true}
            centerLabel={this.renderCenterLabel()}
            backgroundColor={BLUE}
            color={WHITE}
            leftAction={() => goBack(localNestLevel - 1)}
            rightLabel={this.renderRightLabel(goBack)}
            wrapStyle={styles.topBar}
          />
          <View style={styles.commentFeed}>
            {chainShown &&
              parentComments.length > 0 && parentComments.map((parent, i) => parent && (
              <TouchableOpacity key={i} onPress={() => goBack(i + 1)}>
                <Comment
                  comment={parent}
                  commentVote={this.commentVote}
                  routeScene={routeScene}
                />
                {i !== parentComments.length - 1 && (
                  <View style={styles.chainContainer}>
                    <Image
                      source={require('img/icons/comment/icon_comment_chain.png')}
                      style={styles.chain}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {mainComment &&
              <Comment
                comment={mainComment}
                commentVote={this.commentVote}
                backgroundColor={LIGHT_GRAY}
                principleComment={true}
                routeScene={routeScene}
              />
            }
            <ListView
              dataSource={comments}
              enableEmptySections={true}
              renderRow={this.renderRow}
              onEndReachedThreshold={300}
              onEndReached={() => {
                this.setState({ loading: true }, this.getComments(false));
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => this.setState({ refreshing: true }, this.getComments())}
                />
              }
            />
            {loading && !refreshing && <Loading />}
          </View>
          <View style={styles.messageRow}>
            <SendRow
              insertMessage={this.insertMessage}
            />
            <KeyboardSpacing enableAndroid={true} customMargin={70} />
          </View>
          {sortByActive && (
            <DropdownBar
              setSortBy={this.setSortBy}
              translateY={barY}
              scaleY={barScaleY}
              sortButtons={sortButtons}
              topLabel="Sort By"
            />
          )}
        </Animated.View>
        {renderNested && this.renderNestedComment()}
      </View>
    );
  }
}

export default connectFeathers(CommentContainer, { withRef: true });
