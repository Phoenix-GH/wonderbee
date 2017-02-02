import React, { PropTypes } from 'react';
import SwipeableListView from 'SwipeableListView';
import {
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { Thread } from 'AppComponents';
import { styles } from './styles';
import { AuxText } from 'AppFonts';

const renderThreadRow = (thread, updateRead, deleteThread, selectOption, selectMode) => (
  <Thread
    thread={thread}
    selectMode={selectMode}
    isSelected={thread.isSelected}
    routeMessages={() => updateRead(thread)}
    deleteThread={() => deleteThread(thread.id)}
    selectOption={() => selectOption(thread.id)}
    readThread={thread.currentUserRead}
  />
);

function showAlert(threadId, hidden, isAdmin, okFunction) {
  if (hidden) {
    return okFunction(threadId);
  }
  if (isAdmin) {
    return (
      Alert.alert(
        'Leaving the Group',
        'Are you sure you want to leave this group? You are an admin in this discussion.',
        [
          { text: 'Cancel', onPress: () => null },
          { text: 'Leave', onPress: () => okFunction(threadId) }
        ],
      )
    );
  }
  return (
    Alert.alert(
      'Leaving the Group',
      'Are you sure you want to leave this group? An admin of the group will have to re-add you.',
      [
        { text: 'Cancel', onPress: () => null },
        { text: 'Leave', onPress: () => okFunction(threadId) }
      ],
    )
  );
}

function renderThreadDelete(thread, deleteThread) {
  return (
    <TouchableOpacity
      onPress={() => showAlert(thread.id, thread.hidden, thread.isAdmin, deleteThread)}
      style={styles.delete}
    >
      <AuxText style={styles.threadDeleteText}>{thread.deleteText}</AuxText>
    </TouchableOpacity>
  );
}

export function ThreadList({
  threads, getMoreThreads, deleteThread, updateRead,
  selectMode, selectOption, refreshing, onRefresh,
}) {
  return (
    <SwipeableListView
      enableEmptySections={true}
      dataSource={threads}
      renderQuickActions={(thread) => renderThreadDelete(thread, deleteThread)}
      renderRow={(thread) => renderThreadRow(thread, updateRead, deleteThread, selectOption, selectMode)}
      maxSwipeDistance={100}
      onEndReachedThreshold={300}
      onEndReached={getMoreThreads}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
}

ThreadList.propTypes = {
  threads: PropTypes.object.isRequired,
  getMoreThreads: PropTypes.func.isRequired,
  updateRead: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  deleteThread: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
