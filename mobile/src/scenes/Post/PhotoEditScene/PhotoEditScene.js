import React, { PropTypes } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { PhotoEditContainer } from 'AppContainers';
import { SavedImages } from 'AppComponents';
import { STATUSBAR_HEIGHT } from 'AppConstants';

const styles = StyleSheet.styles = {
  container: {
    ...Platform.select({
      ios: {
        marginTop: -STATUSBAR_HEIGHT,
      },
    })
  },
};

export function PhotoEditScene({
  routeScene,
  onBack,
  replaceCurrentScene,
  resetRouteStack,
}) {
  const exitPosting = () => {
    for (let i = 0; i <= 4; i++) {
      onBack();
    }
  };
  return (
    <View style={styles.container}>
      <SavedImages>
        {({
          images,
          updateImage,
          removeAllImages,
          addPreviewImage,
        }) => (
          <PhotoEditContainer
            routeBack={exitPosting}
            routeScene={routeScene}
            images={images}
            removeAllImages={removeAllImages}
            updateImage={updateImage}
            replaceCurrentScene={replaceCurrentScene}
            addPreviewImage={addPreviewImage}
            resetRouteStack={resetRouteStack}
          />
        )}
      </SavedImages>
    </View>
  );
}

PhotoEditScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  replaceCurrentScene: PropTypes.func.isRequired,
  resetRouteStack: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
