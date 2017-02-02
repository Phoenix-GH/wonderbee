import React, { PropTypes } from 'react';
import { SuggestionsContainer } from 'AppContainers';

export const SuggestionsScene = ({ resetRouteStack, onBack, routeScene, signup }) => (
  <SuggestionsContainer
    onSubmit={resetRouteStack}
    onBack={onBack}
    addFromContacts={() => routeScene('SearchContactsScene', { signup })}
    connectFacebook={() => {}}
    signup={signup}
  />
);

SuggestionsScene.propTypes = {
  resetRouteStack: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  signup: PropTypes.bool,
};

SuggestionsScene.defaultPorps = {
  signup: false,
};
