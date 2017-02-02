import React, { PropTypes, Component } from 'react';
import { View, Image, PanResponder, StyleSheet, TouchableOpacity } from 'react-native';
import { UserAvatar, TouchableOrNonTouchable } from 'AppComponents';
import { STATUSBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { BLACK, WHITE, DARK_GRAY, GRAY, LIGHT_GRAY } from 'AppColors';
import { TextBold, TextSemiBold, TextRegular, TextLight } from 'AppFonts';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPrimary: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: WHITE,
    paddingTop: STATUSBAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY
  },
  rowVotes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    right: 2,
  },
  icon: {
    height: 23,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 5,
    top: 2,
  },
  votingIconWrap: {
    height: 22,
    width: 100,
    marginTop: 5,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  avatar: {
    marginRight: 10,
    marginTop: 5,
  },
  usernameWrap: {
    alignItems: 'flex-start',
  },
  iconBack: {
    height: 15,
    tintColor: BLACK,
  },
  side: {
    width: WINDOW_WIDTH / 3,
  },
  rightSide: {
    height: 50,
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 17,
    color: BLACK,
  },
  postTime: {
    fontSize: 12,
    paddingTop: 3,
    color: DARK_GRAY,
  },
  voteCount: {
    fontSize: 16,
    color: GRAY,
  },
  voteCountBar: {
    color: GRAY,
    paddingLeft: 5,
    fontSize: 16
  },
  emojiRow: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  emojiIcon: {
    height: 25,
    width: 25,
  },
  expired: {
    color: GRAY,
    fontSize: 12,
  }
});

function getVotingIcon(imageLength) {
  if (imageLength === 4) {
    return {
      icon: require('img/icons/feed-header/image_voting_four.png'),
      style: {
        height: 22,
        width: 95,
      },
    };
  } else if (imageLength === 3) {
    return {
      icon: require('img/icons/feed-header/image_voting_three.png'),
      style: {
        height: 22,
        width: 68,
      }
    };
  } else if (imageLength === 2) {
    return {
      icon: require('img/icons/feed-header/image_voting_two.png'),
      style: {
        height: 22,
        width: 43,
      }
    };
  }
  return {
    icon: require('img/icons/feed-header/heatmap_voting.png'),
    style: {
      height: 22,
      width: 89,
    }
  };
}

export class FeedHeader extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    voted: PropTypes.bool.isRequired,
    votes: PropTypes.number.isRequired,
    routeBack: PropTypes.func,
    hasBack: PropTypes.bool,
    setActivePost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasBack: false,
  };

  constructor(props, context) {
    super(props, context);
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        this.props.setActivePost();
        return false;
      },
    });
  }

  render() {
    const { post, routeScene, voted, votes, routeBack, hasBack } = this.props;
    const voteWrapProps = {};
    if (post.userDetails.isOwner) {
      voteWrapProps.onPress = () => routeScene('ListUserVoteScene', {
        voting: post.voting,
        multiImage: post.images.length > 1,
        postId: post.id,
        imageIds: post.images.map(img => img.id),
      });
      voteWrapProps.hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };
    }
    const { icon, style } = getVotingIcon(post.images.length);
    const username = post.createdBy.username.length > 12 ?
      `${post.createdBy.username.substring(0, 12)}..` :
      post.createdBy.username;
    return (
      <View
        style={[
          styles.row,
          styles.rowPrimary,
        ]}
        {...this.panResponder.panHandlers}
      >
        {hasBack &&
          <TouchableOpacity
            style={styles.side}
            onPress={routeBack}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <Image
              source={require('img/icons/icon_back.png')}
              style={styles.iconBack}
            />
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={styles.row}
          onPress={() => routeScene('ProfileScene', { userPass: post.createdBy })}
        >
          {!hasBack &&
            <UserAvatar
              avatarUrl={post.createdBy.avatarUrl}
              addBorder={false}
              size={30}
              style={styles.avatar}
            />
          }
          <View style={[styles.usernameWrap, hasBack && { alignItems: 'center' }]}>
            <TextSemiBold style={styles.username}>
              {username}
            </TextSemiBold>
            <TextRegular style={styles.postTime}>
              {post.ago}
            </TextRegular>
          </View>
        </TouchableOpacity>
        <TouchableOrNonTouchable {...voteWrapProps} style={[styles.side, styles.rightSide]}>
          {post.voting ? (
            <View style={styles.votingIconWrap}>
              <Image source={icon} style={style} />
            </View>
          ) : (
            <View style={styles.emojiRow}>
              {post.emojis.map((emj, i) => (
                <Image
                  key={i}
                  source={{ uri: emj.url }}
                  style={styles.emojiIcon}
                />
              ))}
            </View>
          )}
          <View style={styles.rowVotes}>
            <View style={styles.row}>
              <TextBold style={styles.voteCount}>
                {votes}
              </TextBold>
              <TextLight style={styles.voteCountBar}>|</TextLight>
              {post.isExpired && (
                <TextSemiBold style={styles.expired}>
                  {' EXPIRED'}
                </TextSemiBold>
              )}
            </View>
            {!post.isExpired && (
              <Image
                source={require('img/icons/feed-header/checkmark.png')}
                style={[styles.icon, voted && { tintColor: GRAY }]}
              />
            )}
          </View>
        </TouchableOrNonTouchable>
      </View>
    );
  }
}
