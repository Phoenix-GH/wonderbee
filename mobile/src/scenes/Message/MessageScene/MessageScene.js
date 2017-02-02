import React, { PropTypes } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { MessageContainer } from 'AppContainers';
import { SimpleTopNav } from 'AppComponents';
import { styles } from './styles';
import { GREEN } from 'AppColors';
const routeBack = (fromCreator, onBack, resetRouteStack) => {
  if (fromCreator) {
    return resetRouteStack(1);
  }
  return onBack();
};

export function MessageScene({
  routeScene, resetRouteStack, onBack, thread, fromCreatorScene
}) {
  const isAdmin = thread.isAdmin;
  const hidden = thread.hidden;
  return (
    <View style={styles.container}>
      <MessageContainer
        routeBack={() => routeBack(fromCreatorScene, onBack, resetRouteStack)}
        routeScene={routeScene}
        threadId={thread && thread.id}
        isAdmin={isAdmin}
        hidden={hidden}
      />
    </View>
  );
}

MessageScene.propTypes = {
  routeScene: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  resetRouteStack: PropTypes.func.isRequired,
  thread: PropTypes.object,
  fromCreatorScene: PropTypes.bool,
};
