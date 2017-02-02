import React, { Component, PropTypes } from 'react';
import {
  NO_PAN_HANDLERS_SCENES,
  NO_TRANSITION_SCENES,
  NAVBAR_HEIGHT,
} from 'AppConstants';
import {
  NavigationExperimental,
  StyleSheet,
  View,
} from 'react-native';
import {
  LoginScene,
  SignupActionsScene,
  SignupScene,
  SignupMethodScene,
  VerifyPhoneScene,
  SearchContactsScene,
  SuggestionsScene,
  TopicsScene,
  LinkedAccountsScene,
  FindFriendsMethodScene,
  ForgotPasswordScene,
  FeedScene,
  ThreadScene,
  MessageScene,
  ThreadCreateScene,
  CameraScene,
  CameraRollScene,
  PhotoEditScene,
  VideoEditScene,
  PostScene,
  ProfileScene,
  ProfileEditScene,
  FollowerScene,
  SettingScene,
  ChangePasswordScene,
  UpdateEmailAndPhoneScene,
  NotificationScene,
  SearchScene,
  AvatarCameraScene,
  AvatarCameraRollScene,
  ColonyScene,
  GroupScene,
  ColonyCreateScene,
  GroupCreateScene,
  FeedItemModalScene,
  Feed360Scene,
  HiveHomeScene,
  GroupEditScene,
  ListUserVoteScene,
  FollowersApproveScene,
  PushNotificationOptionsScene
} from 'AppScenes';
import { MainLayout } from 'AppLayouts';

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scenes: {
    flex: 1
  },
  cardContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  paddingNeeded: {
    paddingBottom: NAVBAR_HEIGHT,
  }
});

const forFade = (props) => {
  const {
    position,
    scene,
  } = props;

  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];

  const opacity = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 0.3])
  });

  return {
    opacity
  };
};

export class RoutingContainer extends Component {
  static propTypes = {
    onNavChange: PropTypes.func.isRequired,
    navigationState: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);

    this.renderScene = ::this.renderScene;
    this.renderOverlay = ::this.renderOverlay;
    this.routeBack = ::this.routeBack;
    this.configureTransition = ::this.configureTransition;
    this._render = ::this._render;
    this._renderScene = ::this._renderScene;
    this.resetFeed = ::this.resetFeed;
    this.numberOfRoutes = 0;
  }

  componentWillReceiveProps() {
    const { navigationState } = this.props;
    if (navigationState.routes[navigationState.index].name === 'FeedScene') {
      this.resetFeed();
    }
  }

  resetFeed(needScroll = false) {
    return this.feedScene.getFeedRef() && this.feedScene.getFeedRef().resetFeedScene(needScroll);
  }

  configureTransition(next, prev) {
    const { name: nextScene } = next.scene.route;
    const { name: prevScene } = prev.scene.route;

    if (NO_TRANSITION_SCENES.includes(nextScene) && prevScene !== 'CameraScene') {
      return {
        duration: 0,
      };
    }
    return void(0);
  }

  routeBack() {
    const { navigationState } = this.props;
    const currentScene = navigationState.routes[navigationState.index].name;
    switch (currentScene) {
      case 'FeedScene':
      case 'ProfileScene':
      case 'ThreadScene':
      case 'TopicsScene':
      case 'HiveHomeScene':
      case 'SearchScene':
      case 'Feed360Scene':
        return null;
      default:
        return this.props.onNavChange('pop');
    }
  }

  _render(sceneProps) {
    const scenes = sceneProps.scenes.map((scene) => (
      this._renderScene({
        ...sceneProps,
        scene
      })
    ));
    return (
      <View style={styles.container}>
        <View style={styles.scenes}>
          {scenes}
        </View>
        {this.renderOverlay(sceneProps)}
      </View>
    );
  }

  _renderScene(props) {
    const route = props.scene.route;
    const isVertical = route.name === 'CameraScene';

    let style = isVertical ?
      NavigationCard.CardStackStyleInterpolator.forVertical(props) :
      NavigationCard.CardStackStyleInterpolator.forHorizontal(props);
    if (
      route.name === 'FeedItemModalScene' ||
      route.name === 'CameraRollScene'

    ) {
      style = forFade(props);
    }
    const panHandlersProps = {
      ...props,
      onNavigateBack: this.routeBack
    };
    let panHandlers = null;

    if (!NO_PAN_HANDLERS_SCENES.includes(route.name)) {
      panHandlers = isVertical ?
        NavigationCard.CardStackPanResponder.forVertical(panHandlersProps) :
        NavigationCard.CardStackPanResponder.forHorizontal(panHandlersProps);
    }

    let padding = styles.paddingNeeded;

    switch (route.name) {
      case 'LoginScene':
      case 'SignupScene':
      case 'SignupActionsScene':
      case 'SignupMethodScene':
      case 'VerifyPhoneScene':
      case 'FindFriendsMethodScene':
      case 'SearchContactsScene':
      case 'TopicsScene':
      case 'SuggestionsScene':
      case 'ForgotPasswordScene':
      case 'CameraScene':
      case 'PhotoEditScene':
      case 'PostScene':
      case 'CameraRollScene':
      case 'ColonyCreateScene':
      case 'GroupCreateScene':
      case 'FeedItemModalScene':
      case 'AvatarCameraScene':
      case 'AvatarCameraRollScene':
      case 'FeedScene':
      case 'HiveHomeScene':
      case 'MessageScene':
        padding = null;
        break;
      default:
        break;
    }
    return (
      <NavigationCard
        {...props}
        key={`card_${props.scene.key}`}
        panHandlers={panHandlers}
        renderScene={this.renderScene}
        style={[style, styles.cardContainer, padding]}
      />
    );
  }

  renderOverlay(sceneProps) {
    const methods = {
      routeScene: (name, passProps) => this.props.onNavChange('push', { name, passProps }),
      resetRouteStack: (routeIndex, onProfile, hideFeedComments) =>
        this.props.onNavChange('resetRouteStack', { routeIndex, onProfile, hideFeedComments }),
    };
    const activeScene = sceneProps.scenes.filter(scene => scene.isActive)[0].route.name;
    switch (activeScene) {
      case 'LoginScene':
      case 'SignupScene':
      case 'SignupActionsScene':
      case 'SignupMethodScene':
      case 'VerifyPhoneScene':
      case 'FindFriendsMethodScene':
      case 'SearchContactsScene':
      case 'TopicsScene':
      case 'SuggestionsScene':
      case 'ForgotPasswordScene':
      case 'CameraScene':
      case 'PhotoEditScene':
      case 'VideoEditScene':
      case 'PostScene':
      case 'CameraRollScene':
      case 'ColonyCreateScene':
      case 'GroupCreateScene':
      case 'FeedItemModalScene':
      case 'AvatarCameraScene':
      case 'AvatarCameraRollScene':
        return null;
      default:
        return (
          <MainLayout {...methods} activeScene={activeScene} />
        );
    }
  }

  renderScene(sceneProps) {
    const route = sceneProps.scene.route;

    const methods = {
      onBack: () => this.props.onNavChange('pop'),
      replaceCurrentScene: (scene, passProps, key) => (
        this.props.onNavChange('replace', { scene, passProps, key })
      ),
      routeScene: (name, passProps, key) =>
        this.props.onNavChange('push', { name, passProps, key }),
      resetRouteStack: (routeIndex, passProps) => (
        this.props.onNavChange('resetRouteStack', { routeIndex, passProps })
      ),
      jumpTo: (scene) => this.props.onNavChange('jumpTo', { scene }),
    };
    switch (sceneProps.scene.route.name) {
      case 'LoginScene':
        return (
          <LoginScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SignupActionsScene':
        return (
          <SignupActionsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SignupScene':
        return (
          <SignupScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SignupMethodScene':
        return (
          <SignupMethodScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'TopicsScene':
        return (
          <TopicsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'VerifyPhoneScene':
        return (
          <VerifyPhoneScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'FindFriendsMethodScene':
        return (
          <FindFriendsMethodScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SearchContactsScene':
        return (
          <SearchContactsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SuggestionsScene':
        return (
          <SuggestionsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ForgotPasswordScene':
        return (
          <ForgotPasswordScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'FeedScene':
        return (
          <FeedScene
            ref={ref => this.feedScene = ref}
            {...route.passProps}
            {...methods}
          />
        );
      case 'ThreadScene':
        return (
          <ThreadScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'MessageScene':
        return (
          <MessageScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'GroupEditScene':
        return (
          <GroupEditScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ThreadCreateScene':
        return (
          <ThreadCreateScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'CameraScene':
        return (
          <CameraScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'CameraRollScene':
        return (
          <CameraRollScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'PhotoEditScene':
        return (
          <PhotoEditScene
            {...route.passProps}
            {...methods}
          />
        );
        case 'VideoEditScene':
          return (
            <VideoEditScene
              {...route.passProps}
              {...methods}
            />
          );
      case 'PostScene':
        return (
          <PostScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ProfileScene':
        return (
          <ProfileScene
            {...route.passProps}
            {...methods}
            activeScene={sceneProps.scenes.filter(scene => scene.isActive)[0].route.name}
          />
        );
      case 'LinkedAccountsScene':
        return (
          <LinkedAccountsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'FollowerScene':
        return (
          <FollowerScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'FollowersApproveScene':
        return (
          <FollowersApproveScene
            {...methods}
          />
        );
      case 'SettingScene':
        return (
          <SettingScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'PushNotificationOptionsScene':
        return (
          <PushNotificationOptionsScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ChangePasswordScene':
        return (
          <ChangePasswordScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'UpdateEmailAndPhoneScene':
        return (
          <UpdateEmailAndPhoneScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'NotificationScene':
        return (
          <NotificationScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'SearchScene':
        return (
          <SearchScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ProfileEditScene':
        return (
          <ProfileEditScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'AvatarCameraScene':
        return (
          <AvatarCameraScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'AvatarCameraRollScene':
        return (
          <AvatarCameraRollScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ColonyScene':
        return (
          <ColonyScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'GroupScene':
        return (
          <GroupScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ColonyCreateScene':
        return (
          <ColonyCreateScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'GroupCreateScene':
        return (
          <GroupCreateScene
            {...methods}
          />
        );
      case 'FeedItemModalScene':
        return (
          <FeedItemModalScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'Feed360Scene':
        return (
          <Feed360Scene
            {...route.passProps}
            {...methods}
          />
        );
      case 'HiveHomeScene':
        return (
          <HiveHomeScene
            {...route.passProps}
            {...methods}
          />
        );
      case 'ListUserVoteScene':
        return (
          <ListUserVoteScene
            {...route.passProps}
            {...methods}
          />
        );
      default:
        return (
          <LoginScene
            {...route.passProps}
            {...methods}
          />
        );
    }
  }

  render() {
    return (
      <NavigationTransitioner
        configureTransition={this.configureTransition}
        navigationState={this.props.navigationState}
        render={this._render}
      />
    );
  }
}
