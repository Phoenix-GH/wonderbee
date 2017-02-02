import React, { Component, PropTypes } from 'react';
import { SearchContactsContainer } from 'AppContainers';

export class SearchContactsScene extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    shouldGoBack: PropTypes.bool.isRequired,
    source: PropTypes.string.isRequired,
    signup: PropTypes.bool,
  };

  static defaultProps = {
    shouldGoBack: false,
    source: 'contacts',
    signup: false,
  };

  constructor(props, context) {
    super(props, context);
    this.navigateToSuggestions = ::this.navigateToSuggestions;
  }

  navigateToSuggestions() {
    const { routeScene, signup } = this.props;
    return routeScene('SuggestionsScene', { signup });
  }

  render() {
    const { onBack, shouldGoBack, source, signup } = this.props;
    return (
      <SearchContactsContainer
        onDone={!!shouldGoBack ? onBack : this.navigateToSuggestions}
        onBack={onBack}
        source={source}
        signup={signup}
      />
    );
  }
}
