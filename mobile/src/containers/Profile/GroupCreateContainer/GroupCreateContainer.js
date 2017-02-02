import React, { Component, PropTypes } from 'react';
import { View, TextInput, ListView } from 'react-native';
import {
  ProfileTopNav,
  AvatarEdit,
  HorizontalRuler,
  SearchInput,
  SearchResult,
  SuccessDenyButtons,
  Loading,
} from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { AuxText, LabelText } from 'AppFonts';
import { FOLLOWER_SERVICE, SEARCH_SERVICE, GROUP_SERVICE } from 'AppServices';
import { styles } from './styles';

class GroupCreateContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      avatarUrl: '',
      name: '',
      searchValue: '',
      users: [],
      searchResults: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loading: true,
      searchResultsExist: false,
    };
    this.initialResults = [];
    this.changeName = ::this.changeName;
    this.changeSearch = ::this.changeSearch;
    this.onAvatarSave = ::this.onAvatarSave;
    this.removeProfilePic = ::this.removeProfilePic;
    this.addToState = ::this.addToState;
    this.renderRow = ::this.renderRow;
    this.renderListView = ::this.renderListView;
    this.saveGroup = ::this.saveGroup;
    this.getSearch = null;
  }

  componentWillMount() {
    const { feathers } = this.props;
    const query = {
      userId: feathers.get('user').id,
      requestType: 'checkFollowings',
    };
    this.getSearch = makeCancelable(feathers.service(FOLLOWER_SERVICE).find({ query }));
    this.getSearch
      .promise
      .then(results => {
        this.initialResults = results.data;
        this.setState({
          searchResults: this.state.searchResults.cloneWithRows(results.data),
          searchResultsExist: results.total > 0,
          loading: false,
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  componentWillUnmount() {
    if (this.getSearch) {
      this.getSearch.cancel();
    }
  }

  onAvatarSave(avatarUrl) {
    this.setState({ avatarUrl });
  }

  changeName(name) {
    this.setState({ name });
  }

  removeProfilePic() {
    this.setState({ avatarUrl: '' });
  }

  changeSearch(searchValue) {
    if (searchValue.length === 0) {
      const { searchResults, users } = this.state;
      const resultsArray = users.length === 0 ? this.initialResults : users;
      const searchResultsExist = resultsArray.length > 0;
      return this.setState({
        searchValue,
        loading: false,
        searchResultsExist,
        searchResults: searchResults.cloneWithRows(resultsArray),
      });
    }
    const { feathers } = this.props;
    this.setState({ searchValue, loading: true });
    const query = searchValue;
    const lookInto = { users: { exclude: [feathers.get('user').id] } };
    this.getSearch = makeCancelable(
      this.props.feathers.service(SEARCH_SERVICE).create({ query, lookInto })
    );
    return this.getSearch
      .promise
      .then(results => {
        this.setState({
          searchResults: this.state.searchResults.cloneWithRows(results.users),
          loading: false,
          searchResultsExist: results.users.length > 0,
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  addToState(result, resultType) {
    const { users } = this.state;
    const index = users.map(item => item.id).indexOf(result.id);
    this.setState({
      [resultType]: index === -1 ?
        users.concat(result) :
        users.slice(0, index).concat(users.slice(index + 1))
    });
  }

  saveGroup() {
    const { feathers, routeBack } = this.props;
    const { avatarUrl, name, users } = this.state;
    if (name && users.length > 0) {
      const userArray = users.map(user => user.id);
      feathers.service(GROUP_SERVICE).create({
        avatarUrl,
        name,
        hidden: false,
        userArray,
      })
      .then(() => routeBack());
    }
  }

  renderRow(result) {
    const { routeScene } = this.props;
    const { users } = this.state;
    const inState = users.map(user => user.id).indexOf(result.id) > -1;
    const user = result.followedUser || result;
    return (
      <SearchResult
        result={user}
        addToState={this.addToState}
        inState={inState}
        propsToPass={{ userPass: user }}
        resultType="users"
        routeScene={routeScene}
        sceneToRoute={'ProfileScene'}
        addedStateIcon={require('img/icons/icon_profile_joinedGroup.png')}
        notAddedStateIcon={require('img/icons/icon_profile_addGroup.png')}
      />
    );
  }

  renderListView() {
    const { searchResultsExist, searchResults } = this.state;
    if (searchResultsExist) {
      return (
        <ListView
          dataSource={searchResults}
          renderRow={this.renderRow}
        />
      );
    }
    return (
      <LabelText style={styles.center}>No Result!</LabelText>
    );
  }

  render() {
    const { routeBack, routeScene } = this.props;
    const { avatarUrl, searchValue, name, loading } = this.state;
    return (
      <View style={styles.container}>
        <ProfileTopNav
          leftAction={routeBack}
          centerLabel="Create a New Group"
        />
        <View style={styles.row}>
          <AvatarEdit
            onPress={() => routeScene('AvatarCameraScene', { onAvatarSave: this.onAvatarSave })}
            avatarUrl={avatarUrl}
            text={null}
            onRemove={this.removeProfilePic}
          />
          <View>
            <AuxText>Name</AuxText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={this.changeName}
            />
          </View>
        </View>
        <HorizontalRuler />
        <SearchInput
          value={searchValue}
          style={styles.transparent}
          onChange={this.changeSearch}
        />
        <HorizontalRuler />
        <View style={styles.container}>
          {!loading ?
            this.renderListView() :
            <Loading style={styles.center} />
          }
        </View>
        <SuccessDenyButtons
          onSuccess={this.saveGroup}
          onDeny={routeBack}
        />
      </View>
    );
  }
}

export default connectFeathers(GroupCreateContainer);
