import React, { PropTypes } from 'react';
import SwipeableListView from 'SwipeableListView';
import {
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NotificationItem } from 'AppComponents';
import { styles } from './styles';
import { AuxText } from 'AppFonts';

const renderRow = (notification, updateRead, selectMode) => {
  return (
    <NotificationItem
      notification={notification}
      updatedAt={notification.ago}
      selectMode={selectMode}
      routeNotification={() => updateRead(notification)}
    />
  );
};
export const NotificationList = ({
  notifications, getMoreNotifications, deleteNotification, updateRead, selectMode,
  refreshing, onRefresh,
}) => {
  const notificationDataSource = SwipeableListView.getNewDataSource();
  const items = notificationDataSource.cloneWithRowsAndSections({ s1: notifications });
  return (
    <SwipeableListView
      enableEmptySections={true}
      dataSource={items}
      renderRow={(item) => renderRow(item, updateRead, selectMode)}
      maxSwipeDistance={100}
      onEndReachedThreshold={300}
      onEndReached={getMoreNotifications}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
  getMoreNotifications: PropTypes.func.isRequired,
  updateRead: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
