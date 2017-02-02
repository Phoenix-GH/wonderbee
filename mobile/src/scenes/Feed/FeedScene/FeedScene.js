import React, { PropTypes, Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FeedContainer, FeedGridContainer, Feed360Container } from 'AppContainers';
import { DropdownBar } from 'AppComponents';
import { TextBlack } from 'AppFonts';
import { WHITE, YELLOW } from 'AppColors';
import { STATUSBAR_HEIGHT } from 'AppConstants';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downIcon: {
    height: 8,
    width: 13.8,
    marginLeft: 5,
  },
  centerLabel: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  topBar: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  backIcon: {
    height: 20,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  side: {
    width: 100,
    paddingHorizontal: 10,
    justifyContent: 'center',
    zIndex: 2,
  }
});

const sortButtons = [
  { label: 'Feed View', type: 'feed' },
  { label: 'Grid View', type: 'grid' },
  { label: '360 View', type: '360' },
];

export class FeedScene extends Component {
  static propTypes = {
    hashtags: PropTypes.array,
    locations: PropTypes.array,
    handles: PropTypes.array,
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    resetRouteStack: PropTypes.func.isRequired,
    singlePost: PropTypes.object,
    hasHeader: PropTypes.bool,
    requiresRefresh: PropTypes.bool,
    hasNavBar: PropTypes.bool,
    navBarCenterLabel: PropTypes.string,
    newPostExpected: PropTypes.bool,
    hasTopFilterBar: PropTypes.bool,
    resetFeed: PropTypes.bool,
  };

  static defaultProps = {
    singlePost: null,
    routeScene: () => null,
    resetRouteStack: () => null,
    onBack: () => null,
    requiresRefresh: true,
    hasHeader: true,
    hasNavBar: false,
    newPostExpected: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      sortByActive: false,
      barY: new Animated.Value(0),
      barScaleY: new Animated.Value(0),
      viewActive: 'feed',
    };
    this.setView = ::this.setView;
    this.toggleSortBy = ::this.toggleSortBy;
    this.getFeedRef = ::this.getFeedRef;
    this.feed = null;
  }

  getFeedRef() {
    return this.feed && this.feed.getWrappedInstance();
  }

  setView(viewActive) {
    if (viewActive !== this.state.viewActive) {
      this.setState({ viewActive }, this.toggleSortBy);
    } else {
      this.toggleSortBy();
    }
  }

  toggleSortBy() {
    const animateSortBy = (sortByActive) => (
      Animated.parallel([
        Animated.timing(
          this.state.barY, {
            toValue: sortByActive ? 90 : 0,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.barScaleY, {
            toValue: sortByActive ? 1 : 0,
            duration: 200,
          }
        ),
      ]).start(() => {
        if (!sortByActive) {
          this.setState({ sortByActive });
        }
      })
    );
    if (this.state.sortByActive) {
      return animateSortBy(false);
    }
    return this.setState({ sortByActive: true }, () => (
      animateSortBy(true)
    ));
  }

  renderFeed() {
    const {
      hashtags,
      locations,
      handles,
      onBack,
      routeScene,
      resetRouteStack,
      singlePost,
      hasHeader,
      requiresRefresh,
      newPostExpected,
      hasTopFilterBar,
      resetFeed,
    } = this.props;

    switch (this.state.viewActive) {
      case 'grid': {
        return (
          <FeedGridContainer
            routeToFeedItem={routeScene}
            hashtags={hashtags}
            locations={locations}
            routeBack={onBack}
            handles={handles}
          />
        );
      }
      case '360': {
        return (
          <Feed360Container
            routeScene={routeScene}
            hashtags={hashtags}
            locations={locations}
            routeBack={onBack}
            handles={handles}
            showNavigationBar={false}
          />
        );
      }
      case 'feed':
      default: {
        return (
          <FeedContainer
            ref={ref => this.feed = ref}
            routeScene={routeScene}
            goToHive={() => resetRouteStack(3)}
            singlePost={singlePost}
            hasHeader={hasHeader}
            requiresRefresh={requiresRefresh}
            hashtags={hashtags}
            locations={locations}
            routeBack={onBack}
            handles={handles}
            newPostExpected={newPostExpected}
            hasTopFilterBar={hasTopFilterBar}
            resetFeed={resetFeed}
          />
        );
      }
    }
  }

  render() {
    const { onBack, hasNavBar, navBarCenterLabel } = this.props;
    const { barY, barScaleY, sortByActive } = this.state;
    return (
      <View style={styles.container}>
        {hasNavBar &&
          <LinearGradient
            style={styles.topBar}
            colors={['#2ABC7A', '#448891']}
            start={[0.0, 1.0]} end={[1.0, 1.0]}
          >
            <TouchableOpacity
              onPress={onBack}
              style={styles.side}
              hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <Image source={require('img/icons/icon_back.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.toggleSortBy}
              style={styles.row}
              hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <TextBlack
                style={[styles.centerLabel, sortByActive && { color: YELLOW }]}
              >
                {navBarCenterLabel}
              </TextBlack>
              <Image
                source={require('img/icons/comment/icon_comment_down_arrow.png')}
                style={[
                  styles.downIcon,
                  sortByActive && {
                    transform: [{ rotate: '180deg' }],
                    tintColor: YELLOW,
                  }
                ]}
              />
            </TouchableOpacity>
            <View style={styles.side} />
          </LinearGradient>
        }
        {this.renderFeed()}
        {hasNavBar && sortByActive && (
          <DropdownBar
            setSortBy={this.setView}
            translateY={barY}
            scaleY={barScaleY}
            sortButtons={sortButtons}
            topLabel="View By"
          />
        )}
      </View>
    );
  }
}
