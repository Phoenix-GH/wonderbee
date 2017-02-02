import React, { Component, PropTypes } from 'react';
import {
  NavigationExperimental,
  StyleSheet,
  Platform,
  StatusBar,
  View,
  Image,
  BackAndroid
} from 'react-native';
import { RoutingContainer } from './RoutingContainer';
import {
  createTempDirectory,
  shallowEqual,
  Storage,
  PushNotification
} from 'AppUtilities';
import { connectFeathers } from 'AppConnectors';
import { NO_BACK_ANDROID } from 'AppConstants';
import { BackgroundAccounts } from 'AppComponents';
import { USER_SERVICE } from 'AppServices';
import { findIndex } from 'lodash';

const {
  StateUtils: NavigationStateUtils
} = NavigationExperimental;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
const navigationStorage = new Storage('navigation');

class Router extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isProcessed: false,
      navigationState: {
        index: 0,
        routes: [{ key: `Route-${Date.now()}`, name: 'LoginScene' }],
      }
    };
    createTempDirectory(true);
    this.onNavChange = ::this.onNavChange;
    this.onAuthSuccess = ::this.onAuthSuccess;
    this.onPushRegistered = ::this.onPushRegistered;
    this.onNotificationReceived = ::this.onNotificationReceived;
    this.backAndroid = ::this.backAndroid;
    this.router = null;
  }

  componentWillMount() {
    PushNotification.configure(this.onPushRegistered, this.onNotificationReceived);
    BackAndroid.addEventListener('hardwareBackPress', this.backAndroid);
    this.props.feathers.authenticate()
      .then(this.onAuthSuccess)
      .catch(() => {
        this.onNavChange('resetRouteStack', { logout: true });
        this.setState({
          isProcessed: true,
        });
      });
  }

  componentWillUnmount() {
    PushNotification.removeEventListener('register', this.onPushRegistered);
    PushNotification.removeEventListener('notification', this.onNotificationReceived);
    BackAndroid.removeEventListener('hardwareBackPress', this.backAndroid);
  }

  async onAuthSuccess() {
    try {
      try {
        await PushNotification.checkPermissions();
      } catch (e) {
        PushNotification.requestPermission();
      }
      const savedNavigationState = await navigationStorage.getJSON('navigationState');
      if (savedNavigationState) {
        this.setState({
          navigationState: savedNavigationState,
          isProcessed: true,
        });
      } else {
        this.resetRouteStack();
      }
    } catch (e) {
      this.resetRouteStack();
    }
  }

  onPushRegistered(token) {
    const { feathers } = this.props;
    const { id } = feathers.get('user');

    const userService = feathers.service(USER_SERVICE);
    const patch = {
      deviceToken: token,
      platform: Platform.OS
    };

    return userService.patch(id, patch)
      .then(data => {
        console.log('patched', data);
      })
      .catch(e => console.log('error', e));
  }

  onNavChange(type, routeProps) {
    let { navigationState } = this.state;
    switch (type) {
      case 'push': {
        const route = {
          key: routeProps.key ? routeProps.key : `Route-${Date.now()}`,
          name: routeProps.name,
          passProps: routeProps.passProps
        };
        const routes = navigationState.routes.slice(0, navigationState.index + 1)
          .concat(route)
          .concat(navigationState.routes.slice(navigationState.index + 1));
        navigationState = {
          ...navigationState,
          index: navigationState.index + 1,
          routes,
        };
        break;
      }
      case 'pop': {
        const routes = navigationState.routes.slice(0, navigationState.index)
          .concat(navigationState.routes.slice(navigationState.index + 1));

        navigationState = {
          ...navigationState,
          index: navigationState.index - 1,
          routes,
        };
        break;
      }
      case 'jumpTo': {
        const newRoute = navigationState.routes.filter(route => route.name === routeProps.scene)[0];
        navigationState = NavigationStateUtils.jumpTo(navigationState, newRoute.key);
        break;
      }
      case 'resetRouteStack': {
        const initialState = [
          { key: 'ProfileScene', name: 'ProfileScene' },
          { key: 'ThreadScene', name: 'ThreadScene' },
          { key: 'FeedScene', name: 'FeedScene' },
          { key: 'HiveHomeScene', name: 'HiveHomeScene' },
        ];
        const routeStack = routeProps && routeProps.logout ||
        routeProps.passProps && routeProps.passProps.logout ?
          [{ key: 'LoginScene', name: 'LoginScene' }] :
          initialState;

        const index = routeProps && routeProps.routeIndex;
        const newRouteStack = routeStack.map((route, i) => {
          if (i === routeProps.routeIndex && routeProps.passProps) {
            return { ...route, passProps: routeProps.passProps };
          }
          return route;
        });
        navigationState = NavigationStateUtils.reset(navigationState, newRouteStack, index);
        break;
      }
      case 'replace': {
        const route = {
          key: routeProps.key || `Route-${Date.now()}`,
          name: routeProps.scene,
          passProps: routeProps.passProps
        };
        const replaceSceneIndex = routeProps.index || navigationState.index;
        const routes = [...navigationState.routes];

        routes.splice(replaceSceneIndex, 1, route);
        navigationState = {
          ...navigationState,
          routes
        };
        break;
      }
      default:
        break;
    }

    const {
      name: currName,
      passProps: currProps
    } = this.state.navigationState.routes[this.state.navigationState.index];

    const {
      name: nextName,
      passProps: nextProps
    } = navigationState.routes[navigationState.index];
    if (currName === nextName && shallowEqual(currProps, nextProps)) {
      if (currName === 'FeedScene') {
        this.router.resetFeed(true);
      }
      return;
    }
    if (currName === 'FeedScene') {
      const feedIndex = findIndex(navigationState.routes, route => route.name === 'FeedScene');
      if (navigationState.routes[feedIndex].passProps) {
        navigationState.routes[feedIndex].passProps.newPostExpected = false;
        navigationState.routes[feedIndex].passProps.resetFeed = false;
      }
    }
    this.setState({ navigationState });
    try {
      navigationStorage.setJSON('navigationState', navigationState);
    } catch (e) {
      console.log(e);
    }
  }

  onNotificationReceived(notification) {
    console.log(notification);
  }

  backAndroid() {
    const { index, routes } = this.state.navigationState;
    const routeName = routes[index].name;
    if (NO_BACK_ANDROID.includes(routeName)) {
      return false;
    }
    this.onNavChange('pop');
    return true;
  }

  resetRouteStack() {
    this.onNavChange('resetRouteStack');
    this.setState({
      isProcessed: true,
    });
  }

  renderStatusBar() {
    const { index, routes } = this.state.navigationState;
    const props = {
      translucent: true,
      backgroundColor: 'transparent',
      barStyle: 'light-content',
      hidden: false
    };
    switch (routes[index].name) {
      case 'FeedScene':
        props.barStyle = 'default';
        break;
      case 'AvatarCameraRollScene':
      case 'AvatarCameraScene':
      case 'CameraRollScene':
      case 'CameraScene':
      case 'FeedItemModalScene':
      case 'LoginScene':
      case 'PhotoEditScene':
      case 'SignupActionsScene':
      case 'SignupMethodScene':
      case 'SignupScene':
      case 'VerifyPhoneScene':
        props.hidden = true;
        break;
      case 'ChangePasswordScene':
      case 'ColonyCreateScene':
      case 'ColonyScene':
      case 'CommentScene':
      case 'Feed360Scene':
      case 'FindFriendsMethodScene':
      case 'FollowerScene':
      case 'ForgotPasswordScene':
      case 'GroupCreateScene':
      case 'GroupEditScene':
      case 'GroupScene':
      case 'HiveHomeScene':
      case 'LinkedAccountsScene':
      case 'MessageScene':
      case 'NestedCommentScene':
      case 'NotificationScene':
      case 'PostScene':
      case 'ProfileEditScene':
      case 'ProfileScene':
      case 'SearchContactsScene':
      case 'SearchScene':
      case 'SettingScene':
      case 'SuggestionsScene':
      case 'ThreadCreateScene':
      case 'ThreadScene':
      case 'TopicsScene':
      case 'UpdateEmailAndPhoneScene':
      default:
        // do nothing
    }
    return (
      <StatusBar {...props} />
    );
  }

  render() {
    const { isProcessed } = this.state;
    return isProcessed === true ? (
      <View style={styles.container}>
        {this.renderStatusBar()}
        <RoutingContainer
          ref={ref => this.router = ref}
          navigationState={this.state.navigationState}
          onNavChange={this.onNavChange}
        />
      </View>
    ) : (
      <BackgroundAccounts style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <Image source={require('image!icon_signup_logo')} />
      </BackgroundAccounts>
    );
  }
}

const FeathersConnected = connectFeathers(Router, true);

export { FeathersConnected as Router };
