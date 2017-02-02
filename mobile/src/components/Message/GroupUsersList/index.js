/**
 * Created by nick on 16/09/16.
 */
import React, { PropTypes } from 'react';
import {
  View,
  ListView,
  StyleSheet
} from 'react-native';
import { AuxText } from 'AppFonts';
import { DARK_GRAY, GREEN } from 'AppColors';
import { UserAvatar } from 'AppComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacing: {
    height: 1 / 2,
    marginTop: 5,
    alignSelf: 'stretch',
    backgroundColor: DARK_GRAY,
  },
  label: {
    color: DARK_GRAY,
    fontSize: 13,
  },
  wrap: {
    flex: 1,
    alignSelf: 'stretch',
  },
  row: {
    paddingHorizontal: 30,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 15,
    fontSize: 13,
    color: DARK_GRAY
  },
  adminContainer: {
    marginLeft: 15,
    padding: 5,
    height: 23,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  admin: {
    fontSize: 13,
    color: GREEN
  }
});

const renderRow = (user, sectionID, _rowID) => {
  return (
    <View style={styles.row}>
      <UserAvatar
        avatarUrl={user.userInfo.avatarUrl}
        size={30}
        iconStyle={{ width: 13, height: 15 }}
      />
      <AuxText style={styles.username} upperCase={false}>{user.userInfo.name}</AuxText>
      {
        user.isAdmin &&
        <View style={styles.adminContainer}>
          <AuxText style={styles.admin} upperCase={false}>Admin</AuxText>
        </View>
      }
    </View>
  );
}

export const GroupUsersList = ({ users }) => (
  <View style={styles.container}>
    <AuxText style={styles.label} upperCase={false}>Group Members</AuxText>
    <View style={styles.spacing} />
    <ListView
      enableEmptySections={true}
      style={styles.wrap}
      dataSource={users}
      renderRow={renderRow}
    />
    <View style={styles.spacing} />
  </View>
);

GroupUsersList.propTypes = {
  users: PropTypes.object
};


