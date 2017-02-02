import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
 } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { HiveWelcomeModal, HiveGrid } from 'AppComponents';
import { SearchContainer } from 'AppContainers';
import { connectFeathers } from 'AppConnectors';
import { Storage, makeCancelable, AlertMessage } from 'AppUtilities';
import { COLONY_SERVICE } from 'AppServices';
import { WINDOW_WIDTH, SEARCH_FILTERS } from 'AppConstants';
import { DARK_GRAY, GREEN_GRADIENT_START, GREEN_GRADIENT_END } from 'AppColors';
import { styles } from './styles';

class HiveHomeContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showWelcomeModal: false,
      loading: true,
      colonies: [],
      refreshing: false,
      searchText: '',
    };
    this._storage = new Storage('hive');
    this._currentUser = this.props.feathers.get('user').id;
    this._dims = {
      hexagonSize: (WINDOW_WIDTH - 12) / 3,
    };
    this._hexagonHeight = 2 * Math.sqrt(3) * this._dims.hexagonSize / 3;
    this._searchFilter = 0;

    this.onWelcomeClose = ::this.onWelcomeClose;
    this.scrollToMyColonies = ::this.scrollToMyColonies;
    this.onRefresh = ::this.onRefresh;
    this.renderHiveGrid = ::this.renderHiveGrid;
    this.renderTopBar = ::this.renderTopBar;
    this.onSearchChange = ::this.onSearchChange;
    this.onColonySelect = ::this.onColonySelect;
    this.setFilter = ::this.setFilter;
  }

  componentDidMount() {
    this._welcomeModalPromise = makeCancelable(this._storage.getJSON('welcomeShown'));
    this._welcomeModalPromise.promise.then((isShown) => {
      this._welcomeModalPromise = null;
      this.setState({
        showWelcomeModal: !isShown,
      });
    });
    this.getColonies()
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    if (this._welcomeModalPromise) {
      this._welcomeModalPromise.cancel();
    }
    if (this.colonyPromise) {
      this.colonyPromise.cancel();
    }
  }

  onWelcomeClose() {
    this._storage.setJSON('welcomeShown', true);
    this.setState({
      showWelcomeModal: false,
    });
  }

  onRefresh() {
    this.getColonies();
  }

  onSearchChange(text) {
    this.setState({
      searchText: text.toLowerCase(),
    });
  }

  onColonySelect(colony) {
    this.props.routeScene('FeedScene', {
      hasNavBar: true,
      navBarCenterLabel: colony.name,
      locations: colony.locations || [],
      hashtags: colony.hashtags || [],
      handles: colony.users || [],
      hasTopFilterBar: false,
    });
  }

  getColonies() {
    const colonyService = this.props.feathers.service(COLONY_SERVICE);
    this.colonyPromise = makeCancelable(colonyService.find({ query: { all: true } }));
    this.setState({
      refreshing: true,
    });
    return this.colonyPromise.promise
      .then((colonies) => {
        this.setState({
          refreshing: false,
          colonies: colonies.data,
        });
      })
      .catch((error) => {
        this.setState({
          refreshing: false,
          loading: false,
        });
        AlertMessage.fromRequest(error);
      });
  }

  setFilter(filter) {
    this._searchFilter = filter;
  }

  scrollToMyColonies(scrollHeight) {
    this._scrollView.scrollTo({
      y: scrollHeight,
      x: 0,
      animated: true,
    });
  }

  renderTopBar() {
    return (
      <LinearGradient
        style={styles.topBar}
        colors={[GREEN_GRADIENT_START, GREEN_GRADIENT_END]}
        start={[0.0, 1.0]} end={[1.0, 1.0]}
      >
        <View style={styles.actionBar}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder={'Search...'}
              placeholderTextColor={DARK_GRAY}
              value={this.state.searchValue}
              onChangeText={this.onSearchChange}
            />
            <View style={styles.searchIconContainer}>
              <Image
                source={require('img/icons/icon_search.png')}
                style={styles.searchIcon}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.createBar}
            onPress={() => this.props.routeScene('ColonyCreateScene')}
          >
            <Image
              source={require('img/icons/icon_hive_search.png')}
              style={styles.iconAdd}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  renderHiveGrid() {
    const { loading, colonies, refreshing } = this.state;

    return (
      <View style={styles.hiveGrid}>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading || refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {!loading && <HiveGrid
            colonies={colonies}
            currentUser={this._currentUser}
            onLayout={this.scrollToMyColonies}
            onSelect={this.onColonySelect}
          />}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { showWelcomeModal, searchText } = this.state;
    const { feathers, routeScene } = this.props;

    return (
      <View style={styles.container}>
        {this.renderTopBar()}
        <View style={styles.container}>
          <Image
            source={require('img/images/hive_background.png')}
            style={styles.hiveContainer}
          >
            {this.renderHiveGrid()}
            <HiveWelcomeModal visible={showWelcomeModal} onClose={this.onWelcomeClose} />
          </Image>
            {!!searchText.trim().length &&
              <View style={styles.searchContainer}>
                <SearchContainer
                  feathers={feathers}
                  routeScene={routeScene}
                  searchText={searchText}
                  activeFilter={this._searchFilter}
                  setFilter={this.setFilter}
                />
              </View>}
          </View>
        </View>
    );
  }
}

export default connectFeathers(HiveHomeContainer);
