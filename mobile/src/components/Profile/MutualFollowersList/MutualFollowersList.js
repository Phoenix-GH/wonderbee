import React, { PropTypes } from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { styles } from './styles';

export function MutualFollowersList({ list, style, routeScene }) {
  const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
  const listData = dataSource.cloneWithRows(list);

  function renderUserRow(followedUser) { // eslint-disable-line react/prop-types
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => routeScene('ProfileScene', { userPass: followedUser })}
      >
          <UserAvatar
            size={55}
            avatarUrl={followedUser.avatarUrl}
            onPress={() => routeScene('ProfileScene', { userPass: followedUser })}
          />
        <Text style={styles.username}>{followedUser.username}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[style, styles.row]}>
      <View style={styles.info}>
        <Text style={styles.infoText}>{'MUTUAL'}</Text>
        <Text style={styles.infoNumber}>{list.length}</Text>
      </View>
      <View style={styles.listViewContainer}>
        <ListView
          enableEmptySections={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          dataSource={listData}
          renderRow={renderUserRow}
        />
      </View>
    </View>
  );
}

MutualFollowersList.propTypes = {
  isLoading: PropTypes.bool,
  list: PropTypes.array.isRequired,
  style: View.propTypes.style,
  routeScene: PropTypes.func.isRequired,
};
