import React, { Component, PropTypes } from 'react';
import { View, InteractionManager } from 'react-native';
import _ from 'lodash';
import { connectFeathers } from 'AppConnectors';
import { SearchContacts, FacebookModal } from 'AppComponents';
import { AlertMessage, getContacts } from 'AppUtilities';
import { FOLLOWER_SERVICE, USER_SERVICE, FACEBOOK_SERVICE } from 'AppServices';

class SearchContactsContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    source: PropTypes.string.isRequired,
    signup: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleDone = ::this.handleDone;
    this.state = {
      isLoading: true,
      suggestions: [],
      followings: [],
      shouldShowFacebookModal: (
        props.source === 'facebook' && !this.checkIfTokenExistsAndValid(props)
      ),
    };
    this.findFriends = ::this.findFriends;
  }

  componentWillMount() {
    const { io } = this.props.feathers;
    io.on('fb:gettingUserData', () => {
      this.setState({ shouldShowFacebookModal: false });
    });
    io.on('fb:userData', (user) => {
      const userService = this.props.feathers.service(USER_SERVICE);
      if (!!user.error) {
        AlertMessage.fromRequest(user.error);
      }
      const patch = {
        facebookUserId: user.id,
        facebookOAuthToken: user.token.accessToken,
        facebookOAuthTokenExpiresAt: user.token.expiresAt,
      };
      userService.patch(this.props.feathers.get('user').id, patch)
        .then(() => {
          const friendsData = user.friends.data.map(friend => ({
            id: friend.id,
            name: friend.name,
            avatarUrl: friend.picture.data.url
          }));
          this.findFriends(null, friendsData);
        })
        .catch((err) => AlertMessage.fromRequest(err));
    });
    io.on('fb:error', (err) => {
      this.props.onBack();
      AlertMessage.fromRequest(err);
    });
  }

  componentDidMount() {
    const { source, onDone } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (source === 'contacts') {
        return getContacts()
          .then((contacts = []) => this.findFriends(null, contacts))
          .catch(() => onDone());
      }
      if (source !== 'facebook') {
        return null;
      }
      if (!this.state.shouldShowFacebookModal) {
        const facebookService = this.props.feathers.service(FACEBOOK_SERVICE);
        return facebookService.get('facebook')
          .then((friends) => {
            this.findFriends(null, friends);
          })
          .catch(() => {
            this.setState({ shouldShowFacebookModal: true });
          });
      }
      return null;
    });
  }

  componentWillUnmount() {
    const { io } = this.props.feathers;
    io.removeListener('fb:userData');
    io.removeListener('fb:gettingUserData');
    io.removeListener('fb:error');
  }

  checkIfTokenExistsAndValid(props) {
    const user = props.feathers.get('user');
    return (
      !!user.facebookOAuthToken &&
      !!user.facebookOAuthTokenExpiresAt &&
      (new Date().getTime() / 1000 < user.facebookOAuthTokenExpiresAt)
    );
  }

  findFriends(error, contacts) {
    if (error) {
      AlertMessage.showMessage(`Error fetching your friends list: ${error.toString()}`);
      this.setState({ isLoading: false });
      return false;
    }
    const { source, feathers } = this.props;
    const currentUserId = feathers.get('user').id;
    const query = { id: { $ne: currentUserId } };

    if (source === 'contacts') {
      const emails = [];
      const phones = [];
      contacts.forEach((contact) => {
        contact.emailAddresses.forEach(eAddress => {
          emails.push(eAddress.email);
        });
        contact.phoneNumbers.forEach(phoneNumber => {
          phones.push(phoneNumber.number.replace(/\(|\)|\-|\s/g, ''));
        });
      });
      _.assign(query, {
        $or: [
          { email: { $in: emails } },
          { phone: { $in: phones } }
        ]
      });
    } else if (source === 'facebook') {
      _.assign(query, {
        facebookUserId: {
          $in: contacts.map((contact) => contact.id)
        },
      });
    }

    const userService = feathers.service(USER_SERVICE);
    const followerService = feathers.service(FOLLOWER_SERVICE);

    return Promise.all([
      followerService.find({ query: { userId: currentUserId } }),
      userService.find({ query })
    ])
    .then(([followings, suggestions]) => {
      const followingIds = followings.data.map((follow) => _.toInteger(follow.followUserId));
      const suggestionsData = suggestions.map((suggestion) => {
        const isSelected = followingIds.includes(suggestion.id);
        return Object.assign({}, suggestion, { isSelected });
      });
      this.setState({
        followings: followingIds,
        suggestions: suggestionsData,
        isLoading: false,
      });
    })
    .catch(err => {
      this.setState({ isLoading: false });
      AlertMessage.fromRequest(err);
    });
  }

  handleDone(peopleToFollow, peopleToUnfollow) {
    const { onDone, feathers } = this.props;
    const followersService = feathers.service(FOLLOWER_SERVICE);

    return Promise.all([
      followersService.remove(null, {
        query: {
          userId: feathers.get('user').id,
          followUserId: { $in: peopleToUnfollow },
        }
      }),
      followersService.create({ people: peopleToFollow })
    ])
    .then(() => onDone())
    .catch(err => AlertMessage.fromRequest(err));
  }

  render() {
    const { onBack, source, signup } = this.props;
    const { isLoading, suggestions, followings, shouldShowFacebookModal } = this.state;
    return (
      <View>
        <SearchContacts
          onDone={this.handleDone}
          onBack={onBack}
          isLoading={isLoading}
          suggestions={suggestions}
          followings={followings}
          source={source}
          signup={signup}
        />
        {shouldShowFacebookModal &&
          <FacebookModal
            isVisible={shouldShowFacebookModal}
            onSuccess={() => {}}
            onFail={() => {}}
            onCancel={onBack}
          />
        }
      </View>
    );
  }
}

export default connectFeathers(SearchContactsContainer);
