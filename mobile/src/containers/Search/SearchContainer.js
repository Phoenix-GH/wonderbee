import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { SEARCH_DELAY_TIME, SEARCH_FILTERS } from 'AppConstants';
import {
  SearchFilterBar,
  SearchResults
} from 'AppComponents';
import { styles } from './styles';
import debounce from 'lodash/debounce';
import { SEARCH_SERVICE, FOLLOWER_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import ScrollableTabView from 'react-native-scrollable-tab-view';

class SearchContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func,
    searchText: PropTypes.string,
    activeFilter: PropTypes.number,
    setFilter: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: '',
      users: [],
      hashtags: [],
      locations: [],
      colonies: [],
      isLoading: {
        users: false,
        locations: false,
        hashtags: false,
        colonies: false,
      },
      error: null,
    };

    this.activeTab = props.activeFilter || 0;
    this.loaded = {
      users: '',
      locations: '',
      hashtags: '',
      colonies: '',
    };

    this.prepareForFetch = ::this.prepareForFetch;
    this.fetchResults = debounce(::this.fetchResults, SEARCH_DELAY_TIME);
    this.handleSearchTextChange = ::this.handleSearchTextChange;
    this.handleFilterChange = ::this.handleFilterChange;
    this.followUser = ::this.followUser;
  }

  componentWillMount() {
    if (this.props.searchText && this.props.searchText.trim().length) {
      this.handleSearchTextChange(this.props.searchText);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchText !== this.state.searchText) {
      this.handleSearchTextChange(nextProps.searchText);
    }
  }

  componentWillUnmount() {
    if (this._serchPromise) {
      this._serchPromise.cancel();
    }
    this._unmounted = true;
  }

  indexToFilter(index) {
    switch (index) {
      case 0: return ['users', SEARCH_FILTERS.PEOPLE];
      case 1: return ['hashtags', SEARCH_FILTERS.HASHTAGS];
      case 2: return ['locations', SEARCH_FILTERS.PLACES];
      case 3: return ['colonies', SEARCH_FILTERS.COLONIES];
      default: return ['users', SEARCH_FILTERS.PEOPLE];
    }
  }

  fetchResults(lookInto) {
    const { searchText } = this.state;
    if (searchText) {
      const { feathers } = this.props;
      if (this._serchPromise) {
        this._serchPromise.cancel();
      }
      let searchLook;
      if (lookInto === 'users') {
        searchLook = {
          users: {
            exclude: [feathers.get('user').id],
          }
        };
      } else {
        searchLook = {
          [lookInto]: true,
        };
      }

      this._serchPromise = makeCancelable(feathers.service(SEARCH_SERVICE).create({
        query: searchText,
        lookInto: searchLook,
      }));
      this._serchPromise.promise
        .then(results => {
          if (this._unmounted) return;
          const isLoading = Object.assign({}, this.state.isLoading);
          isLoading[lookInto] = false;
          this.loaded[lookInto] = searchText;

          this.setState({
            isLoading,
            [lookInto]: results.data,
          });
        })
        .catch(error => {
          const isLoading = Object.assign({}, this.state.isLoading);
          isLoading[lookInto] = false;

          this.setState({
            isLoading,
            error: error.message
          });
        });
    }
  }

  prepareForFetch() {
    const lookInto = this.indexToFilter(this.activeTab)[0];
    if (this.loaded[lookInto] === this.state.searchText) return;

    const isLoading = {
      users: false,
      locations: false,
      hashtags: false,
      colonies: false,
    };
    isLoading[lookInto] = true;

    this.setState({ isLoading, error: null }, () => this.fetchResults(lookInto));
  }

  followUser(followUserId) {
    this.props.feathers.service(FOLLOWER_SERVICE).create({ followUserId })
    .catch(error => AlertMessage.fromRequest(error));
  }

  handleSearchTextChange(searchText) {
    this.setState({ searchText }, this.prepareForFetch);
  }

  handleFilterChange({ i }) {
    this.activeTab = i;
    this.props.setFilter(i);
    this.prepareForFetch();
  }

  render() {
    const { searchText, isLoading, error, users, colonies, locations, hashtags } = this.state;
    const { routeScene } = this.props;

    return (
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <SearchFilterBar />}
          onChangeTab={this.handleFilterChange}
          page={this.activeTab}
        >
          <View tabLabel={SEARCH_FILTERS.PEOPLE} style={styles.container}>
            {!!searchText && (
              <SearchResults
                results={users}
                type={this.activeTab}
                isLoading={isLoading.users}
                error={error}
                style={styles.searchResults}
                onErrorPress={this.prepareForFetch}
                routeScene={routeScene}
                followUser={this.followUser}
              />
            )}
            </View>
          <View tabLabel={SEARCH_FILTERS.HASHTAGS} style={styles.container}>
            {!!searchText && (
              <SearchResults
                results={hashtags}
                isLoading={isLoading.hashtags}
                error={error}
                style={styles.searchResults}
                onErrorPress={this.prepareForFetch}
                routeScene={routeScene}
                followUser={this.followUser}
              />
            )}
            </View>
          <View tabLabel={SEARCH_FILTERS.PLACES} style={styles.container}>
            {!!searchText && (
              <SearchResults
                results={locations}
                isLoading={isLoading.locations}
                error={error}
                style={styles.searchResults}
                onErrorPress={this.prepareForFetch}
                routeScene={routeScene}
                followUser={this.followUser}
              />
            )}
          </View>
          <View tabLabel={SEARCH_FILTERS.COLONIES} style={styles.container}>
            {!!searchText && (
              <SearchResults
                results={colonies}
                isLoading={isLoading.colonies}
                error={error}
                style={styles.searchResults}
                onErrorPress={this.prepareForFetch}
                routeScene={routeScene}
                followUser={this.followUser}
              />
            )}
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

export default connectFeathers(SearchContainer);
