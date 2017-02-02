import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {
  CustomTextInput,
  Loading,
  BackgroundAccounts,
  UserAvatar,
} from 'AppComponents';
import { ActionButton } from 'AppButtons';
import { connectFeathers } from 'AppConnectors';
import { TextSemiBold, TextRegular } from 'AppFonts';
import { makeCancelable, dismissKeyboard, AlertMessage } from 'AppUtilities';
import {
  USER_SERVICE,
  HASHTAG_SERVICE,
  LOCATION_SERVICE,
  COLONY_SERVICE,
  SEARCH_SERVICE
} from 'AppServices';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { WHITE, DARK_GRAY, GRAY, BLACK } from 'AppColors';
import TextInputState from 'TextInputState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputGroup: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: WINDOW_WIDTH / 5,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    width: WINDOW_WIDTH / 2.5,
    height: WINDOW_HEIGHT / 20,
    borderRadius: WINDOW_HEIGHT / 40,
    zIndex: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: WINDOW_HEIGHT / 15,
    marginBottom: WINDOW_HEIGHT / 30,
  },
  headerLabel: {
    color: WHITE,
    backgroundColor: 'transparent',
    fontSize: 22,
  },
  actionView: {
    alignItems: 'center',

  },
  nameText: {
    color: WHITE,
    fontSize: 14,
    paddingLeft: 5
  },
  noResultText: {
    color: WHITE,
    fontSize: 14,
    paddingTop: 10,
    textAlign: 'center',
  },
  space: {
    marginTop: WINDOW_HEIGHT / 25,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    marginTop: WINDOW_HEIGHT / 50,
    borderWidth: 0,
  }
});

class ColonyCreateContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    copy: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      hashtags: [],
      loading: !!this.props.copy,
      users: [],
      locations: [],
      colonyPrivate: false,
      searchResultsExist: false,
      searchResults: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      lookInto: '',
      value: '',
      isLoading: false,
    };
    this.changePrivate = ::this.changePrivate;
    this.saveColony = ::this.saveColony;
    this.setStateWithArray = ::this.setStateWithArray;
    this.changeName = ::this.changeName;
    this.onBack = ::this.onBack;
    this.backInput = ::this.backInput;
    this.onSearch = ::this.onSearch;
    this.dismissKeyboard = ::this.dismissKeyboard;
    this.renderRow = ::this.renderRow;
    this.renderSearchResult = ::this.renderSearchResult;
    this.calculateTop = ::this.calculateTop;
  }

  componentWillMount() {
    const copy = this.props.copy;
    if (copy) {
      const data = {};
      this.props.feathers.service(USER_SERVICE).find({
        query: {
          id: {
            $in: this.props.copy.users,
          }
        }
      })
        .then(users => data.users = users)
        .then(() => copy.hashtags && this.props.feathers.service(HASHTAG_SERVICE).find({
          query: {
            id: {
              $in: copy.hashtags,
            }
          }
        }))
        .then(hashtags => data.hashtags = hashtags)
        .then(() => copy.locations && this.props.feathers.service(LOCATION_SERVICE).find({
          query: {
            id: {
              $in: copy.locations,
            }
          }
        }))
        .then(locations => data.locations = locations)
        .then(() => this.setState({
          loading: false,
          name: this.props.copy.name,
          users: data.users || [],
          hashtags: data.hashtags || [],
          locations: data.locations || []
        }))
        .catch((error) => {
          this.setState({
            loading: false,
          });
          AlertMessage.fromRequest(error);
        });
    }
  }

  componentWillUnmount() {
    if (this.savePromise) {
      this.savePromise.cancel();
    }
  }

  onBack() {
    if (this._hashtagsOpen || this._locationsOpen || this._usersOpen) {
      return this.backInput();
    }
    return this.props.routeBack();
  }

  onSearch(state) {
    this.setState(state);
  }

  setStateWithArray(array, resultType, result) {
    const index = array.map(item => item.id).indexOf(result.id);
    return this.setState({
      [resultType]: index === -1 ?
        array.concat(result) :
        array.slice(0, index).concat(array.slice(index + 1))
    });
  }

  backInput() {
    if (this._hashtagsOpen) {
      return this._hashtagsCustomInput.done();
    } else if (this._usersOpen) {
      return this._usersCustomInput.done();
    }
    return this._locationsCustomInput.done();
  }

  dismissKeyboard() {
    if (!TextInputState._currentlyFocusedID) {
      this.setState({
        value: ''
      });
    }
    dismissKeyboard();
  }

  changeName(name) {
    this.setState({ name });
  }

  changePrivate(colonyPrivate) {
    this.setState({ colonyPrivate });
  }

  addOrRemove(result, resultType) {
    const { users, hashtags, locations } = this.state;
    switch (resultType) {
      case 'hashtags':
        return this.setStateWithArray(hashtags, resultType, result);
      case 'users':
        return this.setStateWithArray(users, resultType, result);
      case 'locations':
        return this.setStateWithArray(locations, resultType, result);
      default:
        return null;
    }
  }

  saveColony() {
    const colonyToSave = {
      name: this.state.name,
      users: this.state.users.map(user => user.id),
      hashtags: this.state.hashtags.map(hashtag => hashtag.id),
      locations: this.state.locations.map(location => location.id),
      visibility: this.state.colonyPrivate ? 'private' : 'all',
    };
    if (!colonyToSave.name.length ||
        (colonyToSave.users.length +
         colonyToSave.hashtags.length +
         colonyToSave.locations.length === 0)) {
      return;
    }
    const colonyService = this.props.feathers.service(COLONY_SERVICE);
    this.savePromise = makeCancelable(colonyService.create(colonyToSave));
    this.setState({
      loading: true,
    });
    this.savePromise.promise
      .then(() => this.setState({ loading: false }, this.props.routeBack))
      .catch((error) => {
        this.setState({
          loading: false,
        });
        AlertMessage.fromRequest(error);
      });
  }

  calculateTop() {
    const { users, locations, lookInto } = this.state;
    switch (lookInto) {
      case 'locations': return !!users.length * 30;
      case 'hashtags': return (!!users.length + !!locations.length) * 30;
      default: return 0;
    }
  }

  renderRow(result) {
    const { lookInto } = this.state;
    const selectNameKey = lookInto === 'users' ? 'username' : 'name';
    const isSearchShowAvatar = lookInto === 'users';

    return (
      <TouchableOpacity
        style={[styles.row, styles.result]}
        onPress={() => this[`_${lookInto}CustomInput`].addEntry(result)}
      >
        {isSearchShowAvatar && <UserAvatar
          size={30}
          avatarUrl={result.avatarUrl}
        />}
        <View style={styles.name}>
          <TextRegular style={styles.nameText}>{result[selectNameKey]}</TextRegular>
        </View>
      </TouchableOpacity>
    );
  }

  renderSearchResult() {
    const { isLoading, searchResultsExist, searchResults, value, lookInto } = this.state;
    const listStyle = {
      position: 'absolute',
      top: WINDOW_HEIGHT / 20 + this[`_${lookInto}X`] + 2 + this.calculateTop(),
      left: WINDOW_WIDTH / 5,
      width: WINDOW_WIDTH * 3 / 5,
      height: 19 * WINDOW_HEIGHT / 20 - this[`_${lookInto}X`] + - this.calculateTop() - 7,
      alignSelf: 'stretch',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    };
    if (isLoading) {
      return (
        <View style={listStyle}>
          <Loading />
        </View>
      );
    }
    if (!value.trim().length) {
      return <View style={listStyle} />;
    }
    if (searchResultsExist) {
      return (
        <View style={listStyle}>
          <ListView
            dataSource={searchResults}
            renderRow={this.renderRow}
            enableEmptySections={true}
          />
        </View>
      );
    }
    return (
      <View style={[styles.noResult, listStyle]}>
        <TextSemiBold style={styles.noResultText}>No Result!</TextSemiBold>
      </View>
    );
  }

  render() {
    const { feathers } = this.props;
    const {
      loading,
      name,
      users,
      hashtags,
      locations,
      value
    } = this.state;
    const isActive = name.trim().length && (users.length + hashtags.length + locations.length);
    const color = isActive ? BLACK : DARK_GRAY;
    const backgroundColor = isActive ? WHITE : GRAY;
    return (
      <BackgroundAccounts
        type="green"
      >
        <TouchableWithoutFeedback
          onPress={this.dismissKeyboard}
        >
          <View
            style={styles.container}
          >
            <View style={styles.header}>
              <TextSemiBold style={styles.headerLabel}>Create Colony</TextSemiBold>
              <Image source={require('img/icons/icon_hive_search.png')} />
            </View>
            <View>
              <View style={styles.inputGroup}>
                <CustomTextInput
                  onChangeText={this.changeName}
                  value={name}
                  placeholder="Name Your Colony"
                />
              </View>
              <View
                style={styles.inputGroup}
              >
                <CustomTextInput
                  ref={(ref) => this._usersCustomInput = ref}
                  isMultiSelect={true}
                  selectNameKey={'username'}
                  isSearchShowAvatar={true}
                  searchService={feathers.service(SEARCH_SERVICE)}
                  entries={users}
                  lookInto={'users'}
                  preExclude={[feathers.get('user').id]}
                  addEntry={(user) => this.addOrRemove(user, 'users')}
                  removeEntry={(user) => this.addOrRemove(user, 'users')}
                  placeholder="Add Users"
                  onSearch={this.onSearch}
                  onMeasure={(positions) => this._usersX = positions[5]}
                  icon={require('img/icons/signup/icon_signup_logo.png')}
                  invalidChars={/[^a-zA-Z0-9_]/g}
                />
              </View>
              <View
                style={styles.inputGroup}
              >
                <CustomTextInput
                  ref={(ref) => this._locationsCustomInput = ref}
                  isMultiSelect={true}
                  searchService={feathers.service(SEARCH_SERVICE)}
                  entries={locations}
                  lookInto={'locations'}
                  addEntry={(location) => this.addOrRemove(location, 'locations')}
                  removeEntry={(location) => this.addOrRemove(location, 'locations')}
                  placeholder="Add Locations"
                  onSearch={this.onSearch}
                  onMeasure={(positions) => this._locationsX = positions[5]}
                  icon={require('img/icons/signup/icon_signup_logo.png')}
                  invalidChars={/[^a-zA-Z0-9_\s]/g}
                />
              </View>
              <View
                style={styles.inputGroup}
              >
                <CustomTextInput
                  ref={(ref) => this._hashtagsCustomInput = ref}
                  isMultiSelect={true}
                  searchService={feathers.service(SEARCH_SERVICE)}
                  entries={hashtags}
                  lookInto={'hashtags'}
                  addEntry={(hashtag) => this.addOrRemove(hashtag, 'hashtags')}
                  removeEntry={(hashtag) => this.addOrRemove(hashtag, 'hashtags')}
                  placeholder="Add Hashtags"
                  onSearch={this.onSearch}
                  onMeasure={(positions) => this._hashtagsX = positions[5]}
                  icon={require('img/icons/signup/icon_signup_logo.png')}
                  invalidChars={/[^a-zA-Z0-9_]/g}
                />
              </View>
            </View>
            <View style={styles.actionView}>
              <ActionButton
                label="Save"
                upperCase={false}
                isActive={!!isActive}
                onPress={this.saveColony}
                labelStyle={{ color }}
                style={[
                  styles.space,
                  styles.button,
                  { backgroundColor, borderColor: backgroundColor }
                ]}
              />
              <ActionButton
                label="cancel"
                upperCase={false}
                isActive={true}
                onPress={this.onBack}
                labelStyle={{ color: WHITE }}
                style={[
                  styles.button,
                  styles.cancelButton
                ]}
              />
            </View>
            {value.trim().length > 0 && this.renderSearchResult()}
            {loading && <View style={styles.loading}>
              <Loading />
            </View>}
          </View>
        </TouchableWithoutFeedback>
      </BackgroundAccounts>
    );
  }
}

export default connectFeathers(ColonyCreateContainer);
