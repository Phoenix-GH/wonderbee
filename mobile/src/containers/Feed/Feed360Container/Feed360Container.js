import React, { Component, PropTypes } from 'react';
import { Image, InteractionManager } from 'react-native';
import { Colony360View } from 'AppComponents';
import { POST_SERVICE } from 'AppServices';
import { connectFeathers } from 'AppConnectors';
import { makeCancelable } from 'AppUtilities';
import { styles } from './styles';


class Feed360Container extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    colonyName: PropTypes.string,
    routeBack: PropTypes.func,
    routeScene: PropTypes.func.isRequired,
    locations: PropTypes.array,
    hashtags: PropTypes.array,
    handles: PropTypes.array,
    showNavigationBar: PropTypes.bool,
    refreshDone: PropTypes.func,
    refreshing: PropTypes.bool,
  };

  static defaultProps = {
    locations: [],
    hashtags: [],
    handles: [],
    showNavigationBar: true,
    colonyName: '',
    refreshing: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      posts: [],
      $skip: 0,
      $limit: 20,
    };
    this.getPostsPromise = null;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() =>
      this.getPosts()
    );
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.refreshing && !!newProps.refreshing) {
      this.getPosts();
    }
  }

  componentWillUnmount() {
    if (this.getPostsPromise) {
      this.getPostsPromise.cancel();
    }
  }

  onTopicPress(post) {
    this.props.routeScene('FeedScene', {
      singlePost: post,
      hasNavBar: false,
      navBarCenterLabel: post.createdBy.username,
      hasTopFilterBar: false,
    });
  }

  getPosts() {
    const {
      feathers,
      locations,
      hashtags,
      handles
    } = this.props;

    const { posts, $skip, $limit } = this.state;

    const query = {
      $skip,
      $limit,
    };

    if (locations.length > 0) {
      query.locations = { $in: locations };
    }
    if (hashtags.length > 0) {
      query.hashtags = { $in: hashtags };
    }
    if (handles.length > 0) {
      query.userId = { $in: handles };
    }

    const parentRefreshCallback = () => {
      if (this.props.refreshing && !!this.props.refreshDone) {
        this.props.refreshDone();
      }
    };
    this.getPostsPromise = makeCancelable(feathers.service(POST_SERVICE).find({ query }));
    this.getPostsPromise
    .promise
    .then(postData => {
      if (!postData.data.length) return;

      this.setState({
        posts: this.state.posts.concat(postData.data),
        $skip: postData.data.length + $skip,
        $limit: 10,
      }, parentRefreshCallback);

      if (posts.length + postData.data.length < postData.total) {
        this.getPosts();
      }
    }
    );
  }

  render() {
    const { colonyName, routeBack, showNavigationBar } = this.props;
    const { posts } = this.state;
    return (
      <Image
        source={require('img/images/hive_background.png')}
        style={styles.container}
      >
        <Colony360View
          colonyName={colonyName}
          routeBack={routeBack}
          showNavigationBar={showNavigationBar}
          topics={posts.map(post => ({
            type: 'post',
            id: post.id,
            onPress: () => this.onTopicPress(post),
            imageUrl: post.preview && post.preview.url || ' ',
            subtitle: post.description,
            isTrending: false,
          }))}
        />
      </Image>
    );
  }
}

export default connectFeathers(Feed360Container);
