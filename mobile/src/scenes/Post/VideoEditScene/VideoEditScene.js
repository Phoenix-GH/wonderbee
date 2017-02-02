import React, { PropTypes } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { VideoEditContainer } from 'AppContainers';
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

export function VideoEditScene({
  onBack,
  replaceCurrentScene,
}) {
  return (
    <View style={styles.container}>
      <SavedImages>
        {({ videos }) => (
          <VideoEditContainer
            routeBack={onBack}
            replaceCurrentScene={replaceCurrentScene}
            videos={videos}
          />
        )}
      </SavedImages>
    </View>
  );
}

VideoEditScene.propTypes = {
  replaceCurrentScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
