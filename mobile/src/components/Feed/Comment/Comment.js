import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { TextSemiBold, TextLight, CommentText } from 'AppFonts';
import { GRAY } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  centerRow: {
    alignItems: 'center',
  },
  replyIcon: {
    height: 10,
    width: 12.5,
    marginHorizontal: 5,
  },
  username: {
    fontSize: 16,
  },
  ago: {
    fontSize: 10,
    paddingTop: 2
  },
  commentText: {
    fontSize: 14,
    paddingTop: 3
  },
  leftSide: {
    width: 40,
  },
  rightSide: {
    width: 50,
    alignItems: 'center',
  },
  commentWrap: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  voteIcon: {
    marginVertical: 5,
    width: 20,
    height: 19,
    marginHorizontal: 5,
    tintColor: GRAY,
  },
  label: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  down: {
    transform: [{ rotate: '180deg' }]
  },
  votedIcon: {
    tintColor: GRAY,
  },
  upvoteWrap: {
    marginBottom: 10,
  },
  commentCount: {
    fontSize: 10,
  }
});

export class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    commentVote: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeNestedComment: PropTypes.func,
    backgroundColor: PropTypes.string,
    deleteComment: PropTypes.func,
  };

  static defaultProps = {
    backgroundColor: '#FFF',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showFullComment: !props.comment.isTruncated,
    };
    this.showMore = ::this.showMore;
  }

  showMore() {
    if (this.props.comment.isTruncated) {
      this.setState({ showFullComment: !this.state.showFullComment });
    }
  }

  render() {
    const {
      comment,
      backgroundColor,
      routeNestedComment,
      routeScene,
      deleteComment,
      commentVote,
    } = this.props;

    const { upvoted, downvoted, upvotes, downvotes, commentCount } = comment;
    const upvoteIcon = upvoted ?
      require('img/icons/comment/icon_comment_vote.png') :
      require('img/icons/comment/icon_comment_vote_not_filled.png');
    const downvoteIcon = downvoted ?
      require('img/icons/comment/icon_comment_vote.png') :
      require('img/icons/comment/icon_comment_vote_not_filled.png');
    const user = comment.createdBy;
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor }]}
        onPress={routeNestedComment}
        onLongPress={() => comment.isOwner && deleteComment(comment.id)}
      >
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => routeScene('ProfileScene', { userPass: user })}
            style={styles.leftSide}
          >
            <UserAvatar
              avatarUrl={user.avatarUrl}
              addBorder={false}
              size={25}
            />
          </TouchableOpacity>
          <View style={styles.commentWrap}>
            <View style={[styles.row, styles.centerRow]}>
              <TextSemiBold style={styles.username}>{user.username}</TextSemiBold>
              {commentCount > 0 && (
                <View
                  style={[styles.row, styles.centerRow]}
                >
                  <Image
                    source={require('img/icons/comment/icon_comment_reply.png')}
                    style={styles.replyIcon}
                  />
                  <TextSemiBold style={styles.commentCount}>{commentCount}</TextSemiBold>
                </View>
              )}
            </View>
            <TextLight style={styles.ago}>{comment.ago}</TextLight>
            <CommentText
              style={styles.commentText}
              showMore={comment.isTruncated && !this.state.showFullComment && this.showMore}
            >
              {this.state.showFullComment ? comment.full : comment.truncated}
            </CommentText>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity onPress={() => !upvoted && !downvoted && commentVote('upvote')}>
              <View style={[styles.row, styles.centerRow, styles.upvoteWrap]}>
                <TextSemiBold style={styles.label}>{upvotes}</TextSemiBold>
                <Image
                  source={upvoteIcon}
                  style={[styles.voteIcon, upvoted && styles.votedIcon]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => !upvoted && !downvoted && commentVote('downvote')}>
              <View style={[styles.row, styles.centerRow]}>
                <TextSemiBold style={styles.label}>{downvotes}</TextSemiBold>
                <Image
                  source={downvoteIcon}
                  style={[styles.voteIcon, styles.down, downvoted && styles.votedIcon]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
