import React, { PropTypes, Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraRollContainer } from 'AppContainers';
import { SavedImages } from 'AppComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

export class CameraRollScene extends Component {
  static propTypes = {
    backTo: PropTypes.string,
    replaceCurrentScene: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  render() {
    const { routeScene, onBack, replaceCurrentScene, backTo, tab } = this.props;
    const backAction = backTo ?
      () => replaceCurrentScene(backTo) :
      onBack;

    return (
      <View style={styles.container}>
        <SavedImages allImages={false}>
          {({ images, addImage, clearState, removeImage, resizeAllImages, videos, setVideo, removeVideo }) => (
            <CameraRollContainer
              images={images}
              addImage={addImage}
              removeImage={removeImage}
              clearState={clearState}
              routeScene={routeScene}
              routeBack={backAction}
              resizeAllImages={resizeAllImages}
              replaceCurrentScene={replaceCurrentScene}
              videos={videos}
              setVideo={setVideo}
              removeVideo={removeVideo}
              tab={tab}
            />
          )}
        </SavedImages>
      </View>
    );
  }
}
