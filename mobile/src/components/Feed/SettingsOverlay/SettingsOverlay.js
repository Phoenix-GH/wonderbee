import React, { PropTypes } from 'react';
import { View, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { TextBlack, TextSemiBold } from 'AppFonts';
import { GRAY } from 'AppColors';
import { FEED_USER_INFO_OVERLAY_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    left: -FEED_USER_INFO_OVERLAY_WIDTH,
    width: FEED_USER_INFO_OVERLAY_WIDTH,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  username: {
    fontSize: 14,
    marginBottom: 10,
  },
  userDetailButton: {
    width: (FEED_USER_INFO_OVERLAY_WIDTH - FEED_USER_INFO_OVERLAY_WIDTH / 4) / 3,
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSide: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 10,
    marginVertical: 10,
    borderRightWidth: 1,
    borderRightColor: GRAY,
    justifyContent: 'space-around',
    flex: 1,
  },
  stat: {
    fontSize: 16,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
  },
  rightSide: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 10,
    width: FEED_USER_INFO_OVERLAY_WIDTH / 4,
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    resizeMode: 'contain',
    height: 50,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginVertical: 20,
  },
  ownerRow: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  expireWrap: {
    width: (FEED_USER_INFO_OVERLAY_WIDTH - FEED_USER_INFO_OVERLAY_WIDTH / 4) / 6,
    marginRight: 30,
    paddingLeft: 5,
    justifyContent: 'center',
  },
  trashWrap: {
    justifyContent: 'center',
  },
  ownerIcon: {
    width: 22,
    height: 27.2,
    resizeMode: 'contain',
  },
});

const shareButtons = [
  { icon: require('img/icons/feed-settings/link.png'), label: 'copy link', action: 'copyLink' },
  // eslint-disable-next-line max-len
  { icon: require('img/icons/feed-settings/alert.png'), label: 'notify', action: 'sendPushNotification' },
  { icon: require('img/icons/feed-settings/message.png'), label: 'message', action: 'messagePost' },
];

export function SettingsOverlay({
  userDetails,
  containerHeight,
  imageHeight,
  translateX,
  refreshPost,
  deletePost,
  expireVoting,
  messageUser,
  followUser,
  currentlyFollowing,
  followerCount,
  refreshing,
  routeScene,
  ...props,
}) {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: containerHeight,
          top: (imageHeight - containerHeight) / 2,
          transform: [
            { translateX }
          ]
        }
      ]}
    >
      <View style={styles.leftSide}>
        <TextBlack style={styles.username}>
          @{userDetails.username}
        </TextBlack>
        <View style={styles.userDetailRow}>
          <TouchableOpacity
            style={styles.userDetailButton}
            onPress={() => routeScene('ProfileScene', { userPass: { id: userDetails.id } })}
          >
            <TextSemiBold style={styles.stat}>
              {userDetails.postCount}
            </TextSemiBold>
            <TextSemiBold style={styles.statLabel}>
              POSTS
            </TextSemiBold>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userDetailButton}
            onPress={() => routeScene('FollowerScene', { userId: userDetails.id, followers: true })}
          >
            <TextSemiBold style={styles.stat}>
              {followerCount}
            </TextSemiBold>
            <TextSemiBold style={styles.statLabel}>
              FOLLOWERS
            </TextSemiBold>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userDetailButton}
            onPress={
              () => routeScene('FollowerScene', { userId: userDetails.id, followers: false })
            }
          >
            <TextSemiBold style={styles.stat}>
              {userDetails.followingCount}
            </TextSemiBold>
            <TextSemiBold style={styles.statLabel}>
              FOLLOWING
            </TextSemiBold>
          </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
          {!userDetails.isOwner && (
            <TouchableOpacity style={styles.userDetailButton} onPress={messageUser}>
              <Image
                style={styles.actionIcon}
                source={require('img/icons/feed-settings/message_user.png')}
              />
            </TouchableOpacity>
          )}
          {!userDetails.isOwner && (
            <TouchableOpacity style={styles.userDetailButton} onPress={followUser}>
              <Image
                style={styles.actionIcon}
                source={currentlyFollowing ?
                  require('img/icons/feed-settings/followed.png') :
                  require('img/icons/feed-settings/follow.png')
                }
              />
            </TouchableOpacity>
          )}
          {refreshing ? (
            <Progress.CircleSnail size={50} color={GRAY} />
          ) : (
            <TouchableOpacity style={styles.userDetailButton} onPress={refreshPost}>
              <Image
                style={styles.actionIcon}
                source={require('img/icons/feed-settings/refresh.png')}
              />
            </TouchableOpacity>
          )}
        </View>
        {userDetails.isOwner && (
          <View style={styles.ownerRow}>
            <TouchableOpacity onPress={expireVoting} style={styles.expireWrap}>
              <Image
                style={styles.ownerIcon}
                source={require('img/icons/feed-settings/expire.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={deletePost} style={styles.trashWrap}>
              <Image
                style={styles.ownerIcon}
                source={require('img/icons/feed-settings/trash.png')}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.rightSide}>
        <TextSemiBold>
          SHARE
        </TextSemiBold>
        {shareButtons.map((button, i) => (
          <TouchableOpacity
            key={i}
            style={styles.shareButton}
            onPress={props[button.action]}
          >
            <Image
              source={button.icon}
              style={styles.shareIcon}
            />
            <TextSemiBold>{button.label}</TextSemiBold>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

SettingsOverlay.propTypes = {
  userDetails: PropTypes.object.isRequired,
  containerHeight: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  translateX: PropTypes.object.isRequired,
  refreshPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  expireVoting: PropTypes.func.isRequired,
  messagePost: PropTypes.func.isRequired,
  messageUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  sendPushNotification: PropTypes.func.isRequired,
  copyLink: PropTypes.func.isRequired,
  currentlyFollowing: PropTypes.bool.isRequired,
  followerCount: PropTypes.number.isRequired,
  refreshing: PropTypes.bool.isRequired,
  routeScene: PropTypes.func.isRequired,
};
