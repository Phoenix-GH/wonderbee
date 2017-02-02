import React, { Component, PropTypes } from 'react';
import { View, ListView, RefreshControl, StyleSheet } from 'react-native';
import { SimpleTopNav, Loading, Follower } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import {
  HEATMAP_VOTE_SERVICE,
  IMAGE_VOTE_SERVICE,
  POST_VOTE_SERVICE,
  FOLLOWER_SERVICE
} from 'AppServices';
import { TextBold } from 'AppFonts';
import { BLUE } from 'AppColors';
import { makeCancelable, AlertMessage } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 22,
  },
});

class ListUserVoteContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    voting: PropTypes.bool.isRequired,
    multiImage: PropTypes.bool.isRequired,
    postId: PropTypes.number.isRequired,
    imageIds: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.users = [];
    this.findPromise = null;
    this.getUsers();
  }

  state = {
    users: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id,
    }),
    initialRender: false,
    loading: true,
    refreshing: false,
    hasVotes: false,
    $skip: 0,
  };

  componentWillUnmount() {
    if (this.findPromise) {
      this.findPromise.cancel();
    }
  }

  getUsers = (refreshing = false) => {
    const { postId, imageIds, multiImage, voting, feathers } = this.props;
    const { $skip } = this.state;
    const alwaysSet = {
      initialRender: true,
      loading: false,
      refreshing: false,
    };
    let service = POST_VOTE_SERVICE;
    const query = {};
    if (voting) {
      service = multiImage ? IMAGE_VOTE_SERVICE : HEATMAP_VOTE_SERVICE;
      query.imageId = { $in: imageIds };
    } else {
      query.postId = postId;
    }
    this.findPromise = makeCancelable(feathers.service(service).find({ query }));
    this.findPromise.promise
    .then(results => {
      this.users = refreshing ? results : this.users.concat(results);
      this.setState({
        ...alwaysSet,
        hasVotes: results.length > 0,
        $skip: results.length + $skip,
        users: this.state.users.cloneWithRows(this.users),
      });
    })
    .catch(error => console.log(error));
  };

  followUser = (followUserId) => {
    this.props.feathers.service(FOLLOWER_SERVICE).create({ followUserId })
    .catch(error => AlertMessage.fromRequest(error));
  };

  renderUser = (user) => (
    <Follower
      user={user}
      followUser={this.followUser}
      currentlyFollowing={user.currentlyFollowing}
      notCurrentUser={user.notCurrentUser}
      routeScene={this.props.routeScene}
    />
  );

  render() {
    const { initialRender, loading, hasVotes, users, refreshing } = this.state;
    const { routeBack } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          iconBack={true}
          leftAction={routeBack}
          centerLabel="VOTED ON BY"
        />
        {initialRender && hasVotes && (
          <ListView
            dataSource={users}
            renderRow={this.renderUser}
            enableEmptySections={true}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={() => this.setState({ refreshing: true }, () => this.getUsers(true))}
            //   />
            // }
          />
        )}
        {initialRender && !hasVotes && (
          <TextBold style={styles.message}>
            No Votes Yet!
          </TextBold>
        )}
        {loading && <Loading />}
      </View>
    );
  }
}

export default connectFeathers(ListUserVoteContainer);
