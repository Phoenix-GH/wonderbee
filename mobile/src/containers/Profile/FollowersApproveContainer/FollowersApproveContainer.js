import React, { Component, PropTypes } from 'react';
import { View, ListView, RefreshControl, StyleSheet } from 'react-native';
import { SimpleTopNav, Follower } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { GrayHeader } from 'AppFonts';
import { FOLLOWER_SERVICE } from 'AppServices';
import { BLUE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignSelf: 'center',
  }
});

class FollowersApproveContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      follows: new ListView.DataSource({
        rowHasChanged: (r1, r2) => (r1 !== r2),
      }),
      loading: true,
      hasFollowers: false,
      $skip: 0,
      refreshing: false,
      hasMoreToLoad: true,
    };
    this.follows = [];
    this.renderFollow = ::this.renderFollow;
    this.followUser = ::this.followUser;
    this.allowUser = ::this.allowUser;
    this.deleteUser = ::this.deleteUser;
    this.onRefresh = ::this.onRefresh;
    this.renderListView = ::this.renderListView;
    this.getFollows = ::this.getFollows;
    this.getFollowerPromise = null;
    this.isLoading = false;
  }

  componentWillMount() {
    this.getFollows();
  }

  componentWillUnmount() {
    if (this.getFollowerPromise) {
      this.getFollowerPromise.cancel();
    }
  }

  onRefresh() {
    this.setState({ refreshing: true }, () => this.getFollows());
  }

  getFollows() {
    const { feathers } = this.props;
    const { $skip, hasMoreToLoad, refreshing } = this.state;

    if ((hasMoreToLoad || refreshing) && !this.isLoading) {
      this.isLoading = true;
    } else {
      return;
    }
    const query = {
      requestType: 'checkFollowers',
      followUserId: feathers.get('user').id,
      approved: false,
      $skip: refreshing ? 0 : $skip,
      $limit: 100,
    };

    this.getFollowerPromise = makeCancelable(feathers.service(FOLLOWER_SERVICE).find({ query }));
    this.getFollowerPromise
      .promise
      .then(follows => {
        this.follows = refreshing ? follows.data : this.follows.concat(follows.data);
        this.isLoading = false;
        this.setState({
          follows: this.state.follows.cloneWithRows(this.follows),
          hasFollowers: follows.total > 0,
          $skip: refreshing ? follows.limit : $skip + follows.limit,
          loading: false,
          refreshing: false,
          hasMoreToLoad: this.follows.length !== follows.total,
        });
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
        this.isLoading = false;
        this.setState({
          refreshing: false,
        });
      });
  }

  followUser(followUserId) {
    this.props.feathers.service(FOLLOWER_SERVICE).create({ followUserId })
      .catch(error => AlertMessage.fromRequest(error));
  }

  allowUser(follow) {
    this.props.feathers.service(FOLLOWER_SERVICE).patch(follow.id, {
      approved: true,
    })
      .then(() => {
        this.follows = this.follows.filter(follows => follows.id !== follow.id);
        this.setState({
          follows: this.state.follows.cloneWithRows(this.follows),
        });
      });
  }

  deleteUser(follow) {
    this.props.feathers.service(FOLLOWER_SERVICE).remove(follow.id, {
      approved: true,
    })
      .then(() => {
        this.follows = this.follows.filter(follows => follows.id !== follow.id);
        this.setState({
          follows: this.state.follows.cloneWithRows(this.follows),
        });
      });
  }

  renderFollow(user) {
    const { feathers, routeScene } = this.props;
    const followUser = user.createdUser;
    const notCurrentUser = followUser.id !== feathers.get('user').id;
    return (
      <Follower
        user={followUser}
        follow={user}
        followUser={this.followUser}
        allowUser={this.allowUser}
        deleteUser={this.deleteUser}
        currentlyFollowing={user.currentlyFollowing}
        notCurrentUser={notCurrentUser}
        routeScene={routeScene}
      />
    );
  }

  renderListView(centerLabel) {
    if (this.state.hasFollowers) {
      return (
        <ListView
          dataSource={this.state.follows}
          renderRow={this.renderFollow}
          onEndReached={this.getFollows}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      );
    }
    return (
      <GrayHeader style={styles.center}>
        No {centerLabel.toLowerCase()}!
      </GrayHeader>
    );
  }

  render() {
    const { routeBack } = this.props;

    return (
      <View style={styles.container}>
        <SimpleTopNav
          leftAction={routeBack}
          centerLabel={'FOLLOWERS'}
          iconBack={true}
        />
        {!this.state.loading && this.renderListView('FOLLOWERS')}
      </View>
    );
  }
}

export default connectFeathers(FollowersApproveContainer);

