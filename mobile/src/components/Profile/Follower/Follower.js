import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { TextSemiBold, TextRegular } from 'AppFonts';
import { WHITE, BLUE, GRAY, LIGHT_GRAY } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderColor: LIGHT_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  username: {
    marginLeft: 10,
    fontSize: 18
  },
  name: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: WHITE,
  },
  allowIcon: {
    width: 41,
    height: 41,
  },
  allow: {
    borderWidth: 0,
    marginRight: 5,
  },
});

export class Follower extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    currentlyFollowing: PropTypes.bool.isRequired,
    notCurrentUser: PropTypes.bool.isRequired,
    routeScene: PropTypes.func.isRequired,
    follow: PropTypes.object,
    allowUser: PropTypes.func,
    deleteUser: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentlyFollowing: props.currentlyFollowing,
    };
    this.followUser = ::this.followUser;
  }

  followUser(userId) {
    this.setState({ currentlyFollowing: !this.state.currentlyFollowing });
    this.props.followUser(userId);
  }

  render() {
    const { user, notCurrentUser, routeScene, allowUser, deleteUser, follow } = this.props;
    const { currentlyFollowing } = this.state;
    const followIcon = currentlyFollowing ?
      require('img/icons/icon_check_user.png') :
      require('img/icons/icon_add_user.png');
    const maxTextWidth = WINDOW_WIDTH - 130 - (!!allowUser + !!deleteUser) * 46;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => routeScene('ProfileScene', { userPass: user })}
      >
        <View
          style={styles.row}
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={40}
            iconStyle={{ width: 22, height: 25 }}
          />
          <View style={{ flexDirection: 'column', maxWidth: maxTextWidth, }}>
            <TextSemiBold upperCase={true} style={styles.username}>{user.username}</TextSemiBold>
            <TextRegular upperCase={true} style={styles.name}>{user.name}</TextRegular>
          </View>
        </View>
        <View style={styles.row}>
          {deleteUser &&
          <TouchableOpacity
            style={[styles.iconContainer, styles.allow]}
            onPress={() => deleteUser(follow)}
          >
            <Image
              style={styles.allowIcon}
              source={require('img/icons/icon_follow_delete.png')}
            />
          </TouchableOpacity>
          }
          {allowUser &&
          <TouchableOpacity
            style={[styles.iconContainer, styles.allow]}
            onPress={() => allowUser(follow)}
          >
            <Image
              style={styles.allowIcon}
              source={require('img/icons/icon_follow_allow.png')}
            />
          </TouchableOpacity>
          }
          {notCurrentUser &&
            <TouchableOpacity
              style={[styles.iconContainer, {
                borderColor: !currentlyFollowing ? GRAY : BLUE,
                backgroundColor: !currentlyFollowing ? GRAY : BLUE
              }]}
              onPress={() => this.followUser(user.id)}
            >
              <Image
                style={styles.icon}
                source={followIcon}
              />
            </TouchableOpacity>
          }
        </View>
      </TouchableOpacity>
    );
  }
}
