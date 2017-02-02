import React, { Component, PropTypes } from 'react';
import { View, ListView } from 'react-native';
import {
  SimpleTopNav,
  ThreadToLine,
  ThreadUserRow,
  SelectedUser,
} from 'AppComponents';
import {
  SEARCH_SERVICE,
  GROUP_SERVICE,
  FOLLOWER_SERVICE,
} from 'AppServices';
import { connectFeathers } from 'AppConnectors';
import { AlertMessage, makeCancelable } from 'AppUtilities';
import { WINDOW_WIDTH } from 'AppConstants';
import { GREEN } from 'AppColors';
import { styles } from './styles';

class ThreadCreateContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    flagAddUser: PropTypes.bool,
    groupUsers: PropTypes.array,
    groupId: PropTypes.number,
    customHeader: PropTypes.any,
    customCompleteButton: PropTypes.any,
  };

  static defaultProps = {
    customCompleteButton: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      users: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      usersSelected: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loading: false,
      searchResultsExist: false,
      text: '',
      nextDisabled: true,
    };
    this.usersSelected = [];
    this.users = [];
    this.followers = [];
    this.addGroupUser = ::this.addGroupUser;
    this.selectUser = ::this.selectUser;
    this.renderUserRow = ::this.renderUserRow;
    this.onChangeText = ::this.onChangeText;
    this.renderUserSelected = ::this.renderUserSelected;
    this.scrollToEnd = ::this.scrollToEnd;
    this.removeSelected = ::this.removeSelected;
    this.routeToMessages = ::this.routeToMessages;
    this.getFollowers = ::this.getFollowers;
    this.getSearch = null;
    this.selectList = null;
    this.getFollowers();
  }

  componentWillUnmount() {
    if (this.getSearch) {
      this.getSearch.cancel();
    }
  }

  onChangeText(text) {
    if (text.length > 0) {
      const { feathers } = this.props;
      this.setState({ text, loading: true });
      let exclude = [
        ...this.usersSelected.map(user => user.id),
        feathers.get('user').id,
      ];
      if (this.props.flagAddUser) {
        exclude = [
          ...this.props.groupUsers.map(user => user.userId),
          ...this.usersSelected.map(user => user.id),
          feathers.get('user').id,
        ];
      }
      const lookInto = { users: { exclude } };
      this.getSearch = makeCancelable(
        feathers.service(SEARCH_SERVICE).create({ query: text, lookInto })
      );
      this.getSearch
      .promise
      .then(results => {
        this.users = results.users;
        this.setState({
          users: this.state.users.cloneWithRows(results.users),
          loading: false,
          searchResultsExist: results.users.length > 0,
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
    } else {
      this.setState({ text });
    }
  }

  getFollowers() {
    const { feathers } = this.props;
    const query = {
      requestType: 'checkFollowings',
    };
    this.getSearch = makeCancelable(feathers.service(FOLLOWER_SERVICE).find({ query }));
    this.getSearch
    .promise
    .then(results => {
      this.followers = results.data.map(user => user.followedUser);
      this.setState({
        users: this.state.users.cloneWithRows(this.followers),
        searchResultsExist: results.total > 0,
        loading: false,
      });
    })
    .catch(error => AlertMessage.fromRequest(error));
  }

  scrollToEnd(width) {
    if (width > WINDOW_WIDTH) {
      this.selectList.scrollTo({ x: width - WINDOW_WIDTH });
    }
  }

  selectUser(user) {
    this.usersSelected = this.usersSelected.concat(user);
    this.users = this.users.filter(result => result.id !== user.id);
    this.setState({
      usersSelected: this.state.usersSelected.cloneWithRows(this.usersSelected),
      users: this.state.users.cloneWithRows(this.users),
      nextDisabled: this.usersSelected.length === 0,
    });
  }

  removeSelected(selected) {
    this.usersSelected = this.usersSelected.filter(user => selected.id !== user.id);
    this.users = [selected].concat(this.users);
    this.setState({
      usersSelected: this.state.usersSelected.cloneWithRows(this.usersSelected),
      users: this.state.users.cloneWithRows(this.users),
      nextDisabled: this.usersSelected.length === 0,
    });
  }

  routeToMessages() {
    const { feathers, routeScene } = this.props;
    feathers.service(GROUP_SERVICE).find({ query: { groupMemberHash: this.usersSelected } })
    .then(result => {
      if (result.data.length > 0) {
        return routeScene('MessageScene', { thread: result.data[0], fromCreatorScene: true });
      }
    })
    .catch(error => AlertMessage.fromRequest(error));
  }

  addGroupUser() {
    const { feathers, routeBack, groupId } = this.props;
    const users = [...this.usersSelected.map(user => ({
      id: user.id,
      username: user.username
    }))];
    feathers.service(GROUP_SERVICE)
      .patch(groupId, {
        requestType: 'addGroupUsers',
        users
      })
      .then(() => {
        routeBack();
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  renderUserRow(user) {
    return (
      <ThreadUserRow
        handlePress={() => this.selectUser(user)}
        user={user}
      />
    );
  }

  renderUserSelected(user) {
    return (
      <SelectedUser user={user} removeSelected={this.removeSelected} />
    );
  }

  render() {
    const {
      users,
      usersSelected,
      nextDisabled,
    } = this.state;
    const { customHeader, customCompleteButton } = this.props;
    return (
      <View style={styles.container}>
      {!customHeader ? (
        <SimpleTopNav
          iconBack={true}
          leftAction={this.props.routeBack}
          centerLabel={this.props.flagAddUser ? 'Add User' : 'New Message'}
          sideFontSize={16}
          rightAction={this.props.flagAddUser ? this.addGroupUser : this.routeToMessages}
          rightLabel={this.props.flagAddUser ? 'Save' : 'Next'}
          gradientColor={'green'}
          rightLabelDisabled={nextDisabled}
        />
      ) : (
        customHeader
      )}
        <ThreadToLine
          onChangeText={this.onChangeText}
          inputValue={this.state.text}
        />
        <View style={styles.selected}>
          <ListView
            ref={list => this.selectList = list}
            contentContainerStyle={styles.selectedList}
            dataSource={usersSelected}
            renderRow={this.renderUserSelected}
            enableEmptySections={true}
            horizontal={true}
            onContentSizeChange={this.scrollToEnd}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.container}>
          <ListView
            contentContainerStyle={styles.container}
            dataSource={users}
            renderRow={this.renderUserRow}
            enableEmptySections={true}
          />
        </View>
        {customCompleteButton}
      </View>
    );
  }
}
export default connectFeathers(ThreadCreateContainer);
