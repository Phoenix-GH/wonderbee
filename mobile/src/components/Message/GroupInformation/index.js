/**
 * Created by nick on 16/09/16.
 */
import React, { PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { UserAvatar } from 'AppComponents';
import { BG_LIGHT_GRAY, GRAY, WHITE, DARK_GRAY } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';
import { AuxText } from 'AppFonts';

const styles = StyleSheet.create({
  groupInfoContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: BG_LIGHT_GRAY,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherInfoContainer: {
    flex: 1.3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconEditAvatarContainer: {
    position: 'absolute',
    top: 10,
    left: (WINDOW_WIDTH / 2.3 - 100) / 2,
    backgroundColor: GRAY,
    borderColor: GRAY,
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconRemoveAvatarContainer: {
    position: 'absolute',
    top: 10,
    left: (WINDOW_WIDTH / 2.3 + 30) / 2,
    backgroundColor: GRAY,
    borderColor: GRAY,
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconDelete: {
    width: 13,
    height: 13,
    tintColor: WHITE,
  },
  icon: {
    width: 16,
    height: 14,
    tintColor: WHITE,
  },
  inputContainer: {
    width: WINDOW_WIDTH / 2,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  hasBorderBottom: {
    width: WINDOW_WIDTH / 2.5,
    padding: 3,
    borderBottomWidth: 1,
    borderColor: GRAY,
  },
  input: {
    flex: 1,
    height: 20,
    color: DARK_GRAY,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    padding: 0,
  },
  iconPen: {
    width: 16,
    height: 14,
    tintColor: GRAY,
    margin: 5,
  },
  createdAt: {
    fontSize: 12,
    marginTop: 5,
    color: GRAY,
  }
});

export const GroupInformation = ({
  groupName, createdAt, userCount, avatarUrl,
  onAvatarEdit, changeGroupName, isAdmin, onRemoveAvatar, onGroupNameBlur
}) => {
  const date = createdAt ? moment(createdAt).format('LL') : '';
  const strUserCount = `${userCount} Member${userCount !== 1 ? 's' : ''}`;
  return (
    <View style={styles.groupInfoContainer}>
      <View style={styles.avatarContainer}>
        <UserAvatar avatarUrl={avatarUrl} onPress={onAvatarEdit} />
        {isAdmin &&
          <TouchableOpacity style={styles.iconEditAvatarContainer} onPress={onAvatarEdit}>
            <Image
              style={styles.icon}
              source={require('img/icons/icon_edit.png')}
            />
          </TouchableOpacity>
        }
        {(!!avatarUrl && isAdmin) &&
        <TouchableOpacity style={styles.iconRemoveAvatarContainer} onPress={onRemoveAvatar}>
          <Image
            style={styles.iconDelete}
            source={require('img/icons/icon_cancel.png')}
          />
        </TouchableOpacity>
        }
      </View>
      <View style={styles.otherInfoContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.hasBorderBottom}>
            {isAdmin ?
              <TextInput
                style={styles.input}
                value={groupName}
                underlineColorAndroid="transparent"
                onChangeText={changeGroupName}
                onBlur={onGroupNameBlur}
                clearButtonMode="while-editing"
              />
              :
              <Text style={styles.input}>
                {groupName}
              </Text>
            }

          </View>
          {isAdmin &&
            <Image
              style={styles.iconPen}
              source={require('img/icons/icon_edit_pen.png')}
            />
          }
        </View>
        <AuxText style={styles.createdAt} upperCase={false}>Created {date}</AuxText>
        <AuxText style={styles.createdAt} upperCase={false}>{strUserCount}</AuxText>
      </View>
    </View>
  );
};

GroupInformation.propTypes = {
  groupName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  avatarUrl: PropTypes.string,
  onAvatarEdit: PropTypes.func.isRequired,
  onGroupNameBlur: PropTypes.func.isRequired,
  onRemoveAvatar: PropTypes.func.isRequired,
  changeGroupName: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};
