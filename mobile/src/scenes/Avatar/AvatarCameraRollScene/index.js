import React, { PropTypes, Component } from 'react';
import { AvatarCameraRollContainer } from 'AppContainers';
import { SavedImages } from 'AppComponents';

export class AvatarCameraRollScene extends Component {
  static propTypes = {
    replaceCurrentScene: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    imageSelected: PropTypes.func.isRequired,
  };

  state = {
    tab: 'Photos',
  };

  toggleTab = () => {
    this.setState({
      tab: 'Photos',
    });
  }

  render() {
    const { routeScene, onBack, replaceCurrentScene, imageSelected } = this.props;
    return (
      <AvatarCameraRollContainer
        routeScene={routeScene}
        routeBack={onBack}
        replaceCurrentScene={replaceCurrentScene}
        imageSelected={imageSelected}
        toggleTab={this.toggleTab}
        tab={this.state.tab}
      />
    );
  }
}
