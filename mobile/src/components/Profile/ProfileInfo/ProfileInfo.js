import React, { PropTypes } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextRegular, TextSemiBold } from 'AppFonts';
import { DARK_GRAY, BLUE, GREEN, WHITE, GRAY } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';
import { UserAvatar, Badge } from 'AppComponents';

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
  },
  userRow: {
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  center: {
    alignSelf: 'center',
  },
  userAvatar: {
    marginHorizontal: 20,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowRadius: 5,
        shadowOffset: {
          height: 10,
          width: 0,
        },
      },
    }),
  },
  bioText: {
    fontSize: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    lineHeight: 16,
    textAlign: 'center'
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
  statRow: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  nameLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 5
  },
  userFullName: {
    fontSize: 16,
    paddingBottom: 2
  },
  userFullNameCenter: {
    width: WINDOW_WIDTH / 2,
    textAlign: 'right'
  },
  userLocationContainer: {
    flex: 1,
    marginLeft: 10,
    borderLeftColor: DARK_GRAY,
    borderLeftWidth: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: WINDOW_WIDTH / 2,
    overflow: 'hidden'
  },
  iconLocation: {
    paddingLeft: 10,
    width: 15,
    height: 15,
  },
  userLocation: {
    fontSize: 14,
    color: BLUE,
    paddingBottom: 2,
    flexWrap: 'wrap',
    maxWidth: WINDOW_WIDTH / 2,
    overflow: 'hidden'
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderColor: GREEN,
    borderWidth: 1,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: WHITE,
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: 15,
  },
});

export const ProfileInfo = ({
  currentUser,
  isCurrentUser,
  badgeCount,
  follow,
  currentlyFollowing,
  routeMessage,
  onAvatarPress,
}) => {
  const followIcon = currentlyFollowing ? require('img/icons/icon_check_user.png') :
      require('img/icons/icon_add_user.png');
  function renderAvatarRow() {
    return (
      <View style={{ marginTop: 20 }} >
        <View style={[styles.row, styles.userRow]} >
          <View style={[styles.statColumn]}>
            {
              !isCurrentUser &&
              <TouchableOpacity style={styles.iconContainer} onPress={routeMessage}>
                <Image
                  style={styles.icon}
                  source={require('img/icons/icon_new_thread.png')}
                />
              </TouchableOpacity>
            }
          </View>
          {isCurrentUser && badgeCount >= 1 ? <View>
            <UserAvatar
              avatarUrl={currentUser.avatarUrl}
              style={[styles.center, styles.userAvatar, styles.shadow]}
              onPress={onAvatarPress}
              size={80}
            />
            <Badge
              size={20}
              number={badgeCount}
              color={'red'}
              style={styles.badge}
            />
          </View> :
          <UserAvatar
            avatarUrl={currentUser.avatarUrl}
            style={[styles.center, styles.userAvatar, styles.shadow]}
            size={80}
          />}
          <View style={[styles.statColumn]}>
            {
              !isCurrentUser &&
              <TouchableOpacity
                style={[styles.iconContainer, {
                  borderColor: !currentlyFollowing ? GRAY : BLUE,
                  backgroundColor: !currentlyFollowing ? GRAY : BLUE
                }]}
                onPress={follow}
              >
                <Image
                  style={styles.icon}
                  source={followIcon}
                />
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }
  const shouldShowLocation = currentUser.location && currentUser.displayLocation &&
    (isCurrentUser || currentlyFollowing || !currentUser.private);
  const showLocation = shouldShowLocation && [
    currentUser.location.city,
    currentUser.location.state,
    currentUser.location.country
  ].filter(str => !!str).join(', ');

  return (
  <View style={styles.container}>
    { renderAvatarRow() }
    <View style={[styles.nameLocationRow]}>
      <TextSemiBold
        style={[
          styles.userFullName,
          shouldShowLocation && styles.userFullNameCenter
        ]}
      >
        {currentUser.name}
      </TextSemiBold>
      {shouldShowLocation && (
        <View style={[styles.userLocationContainer]}>
          <Image
            style={styles.iconLocation}
            source={require('img/icons/icon_location.png')}
          />
          <TextSemiBold numberOfLines={1} style={[styles.userLocation]} >
              {showLocation}
          </TextSemiBold>
        </View>
      )}

    </View>
    <TextRegular style={[styles.bioText]} >
      {currentUser.bio}
    </TextRegular>
  </View>
  );
};

ProfileInfo.propTypes = {
  currentUser: PropTypes.object.isRequired,
  isCurrentUser: PropTypes.bool,
  badgeCount: PropTypes.number,
  currentlyFollowing: PropTypes.bool,
  routeMessage: PropTypes.func,
  follow: PropTypes.func,
  onAvatarPress: PropTypes.func,
};
