import React, { PropTypes } from 'react';
import { CameraContainer } from 'AppContainers';
import { SavedImages } from 'AppComponents';

export function CameraScene({
  routeScene,
  onBack,
  clearImages,
  replaceCurrentScene,
  backTo
}) {
  const backAction = backTo ?
    () => replaceCurrentScene(backTo) :
    onBack;

  return (
    <SavedImages>
      {({ addImage, removeAllImages, resizeImage, clearState, resizeAllImages, setVideo }) => (
        <CameraContainer
          routeBack={backAction}
          routeScene={routeScene}
          replaceCurrentScene={replaceCurrentScene}
          addImage={addImage}
          removeAllImages={removeAllImages}
          resizeImage={resizeImage}
          clearImages={clearImages}
          resizeAllImages={resizeAllImages}
          clearState={clearState}
          backTo={backTo}

          setVideo={setVideo}
        />
      )}
    </SavedImages>
  );
}

CameraScene.propTypes = {
  backTo: PropTypes.string,
  replaceCurrentScene: PropTypes.func.isRequired,
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  clearImages: PropTypes.bool.isRequired,
};

CameraScene.defaultProps = {
  clearImages: false,
};
