import React, { PropTypes, Component } from 'react';
import { FindFriendsMethodContainer } from 'AppContainers';
import { BackgroundAccounts } from 'AppComponents';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});
export class FindFriendsMethodScene extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.handleSearchContacts = ::this.handleSearchContacts;
    this.handleConnectToFacebook = ::this.handleConnectToFacebook;
    this.handleSkip = ::this.handleSkip;
  }
  handleSearchContacts() {
    const { routeScene, onBack } = this.props;
    return routeScene('SearchContactsScene', { signup: true, routeScene, onBack, });
  }
  handleConnectToFacebook() {
    // @TODO
  }
  handleSkip() {
    const { routeScene } = this.props;
    return routeScene('SuggestionsScene', { signup: true });
  }
  render() {
    return (
      <BackgroundAccounts
        style={styles.flex}
        type={'green'}
      >
        <FindFriendsMethodContainer
          skip={this.handleSkip}
          connectToFacebook={this.handleConnectToFacebook}
          searchContacts={this.handleSearchContacts}
          onBack={this.props.onBack}
        />
      </BackgroundAccounts>
    );
  }
}
