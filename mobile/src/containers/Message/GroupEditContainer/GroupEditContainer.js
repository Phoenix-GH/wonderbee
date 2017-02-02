import React, { Component, PropTypes } from 'react';
import {
  View,
  Alert,
  InteractionManager,
  TouchableOpacity,
  ListView,
  Image
} from 'react-native';
import {
  SimpleTopNav,
  GroupInformation,
  GroupUsersList
} from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { GROUP_SERVICE, GROUP_USER_SERVICE } from 'AppServices';
import { WHITE, GREEN } from 'AppColors';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { AuxText } from 'AppFonts';
import { styles } from './styles';

class GroupEditContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    jumpTo: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    groupId: PropTypes.number,
    isAdmin: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      groupName: '',
      avatarUrl: '',
      createdAt: '',
      userCount: 0,
      submitting: false,
      users: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
    this.saveInformation = ::this.saveInformation;
    this.removeAvatarURL = ::this.removeAvatarURL;
    this.onAvatarSave = ::this.onAvatarSave;
    this.onAvatarEdit = ::this.onAvatarEdit;
    this.changeGroupName = ::this.changeGroupName;
    this.confirmLeaveGroup = ::this.confirmLeaveGroup;
    this.leaveGroup = ::this.leaveGroup;
    this.addUser = ::this.addUser;
    this.onRefresh = ::this.onRefresh;
    this.users = [];
    this.modal = null;
    this.getGroupInformationPromise = null;
    this.getGroupUsersPromise = null;
  }

  componentWillMount() {
    const { feathers } = this.props;
    this.flagMounted = true;
    const groupService = feathers.service(GROUP_SERVICE);
    groupService.on('patched', this.onRefresh);
    InteractionManager.runAfterInteractions(() => {
      this.getGroupUsers();
      this.getGroupInformation();
    });
  }

  componentWillUnmount() {
    const { feathers } = this.props;
    const groupService = feathers.service(GROUP_SERVICE);
    groupService.off('patched', this.onRefresh);
    this.onRefresh = null;
    this.flagMounted = false;
    if (this.getGroupInformationPromise) {
      this.getGroupInformationPromise.cancel();
      this.getGroupInformationPromise = null;
    }
    if (this.getGroupUsersPromise) {
      this.getGroupUsersPromise.cancel();
      this.getGroupUsersPromise = null;
    }
  }

  onRefresh() {
    if (this.onRefresh) {
      this.getGroupUsers();
    }
  }
  onAvatarEdit() {
    this.props.routeScene('AvatarCameraScene', { onAvatarSave: this.onAvatarSave });
  }

  onAvatarSave(avatarUrl) {
    this.setState({ avatarUrl });
    this.saveAvatar(avatarUrl);
  }

  getGroupUsers() {
    const { feathers, groupId } = this.props;
    const groupUserService = feathers.service(GROUP_USER_SERVICE);
    if (this.flagMounted) {
      const query = {
        groupId,
        deleted: false,
      };
      this.getGroupUsersPromise = makeCancelable(groupUserService.find({ query }));
      this.getGroupUsersPromise
        .promise
        .then(result => {
          result.data.sort((a, b) => {
            if (b.isAdmin) {
              return 1;
            }
            if (a.isAdmin) {
              return 1;
            }
          });
          this.users = result.data;
          if (this.getGroupUsersPromise) {
            this.setState({
              userCount: result.data.length,
              users: this.state.users.cloneWithRows(result.data)
            });
          }
        })
        .catch(error => {
          AlertMessage.fromRequest(error);
        });
    }
  }

  getGroupInformation() {
    const { feathers, groupId } = this.props;
    const groupService = feathers.service(GROUP_SERVICE);
    this.getGroupInformationPromise = makeCancelable(groupService.find({ query: { id: groupId } }));
    this.getGroupInformationPromise
      .promise
      .then(group => {
        if (group.data && group.data[0]) {
          const { name, avatarUrl, userCount, createdAt } = group.data[0];
          if (this.getGroupInformationPromise) {
            this.setState({ groupName: name, avatarUrl, createdAt, userCount });
          }
        }
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
      });
  }

  changeGroupName(groupName) {
    this.setState({ groupName });
  }

  removeAvatarURL() {
    this.setState({ avatarUrl: null });
    this.saveAvatar(null);
  }

  async saveAvatar(avatarUrl) {
    this.setState({ submitting: true });
    try {
      const { feathers, groupId } = this.props;
      await feathers.service(GROUP_SERVICE).patch(groupId, { avatarUrl });
    } catch (error) {
      Alert.alert('Failed to remove group avatar', error.message);
    }
  }

  async saveInformation() {
    this.setState({ submitting: true });
    try {
      const { feathers, groupId } = this.props;
      await feathers.service(GROUP_SERVICE).patch(groupId, { name: this.state.groupName, requestType: 'renameGroup' });
    } catch (error) {
      Alert.alert('Failed to update group settings', error.message);
    }
  }

  leaveGroup() {
    const { feathers, jumpTo } = this.props;
    feathers.service(GROUP_SERVICE)
      .patch(this.props.groupId, { requestType: 'leaveGroup' })
      .then(() => {
        jumpTo('ThreadScene');
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  confirmLeaveGroup() {
    if (this.props.isAdmin) {
      return (
        Alert.alert(
          'Leaving the Group',
          'Are you sure you want to leave this group? You are an admin in this discussion.',
          [
            { text: 'Cancel', onPress: () => null },
            { text: 'Leave', onPress: this.leaveGroup }
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
          { text: 'Leave', onPress: this.leaveGroup }
        ],
      )
    );
  }

  addUser() {
    if (this.props.isAdmin) {
      this.props.routeScene('ThreadCreateScene', {
        flagAddUser: true, groupUsers: this.users, groupId: this.props.groupId
      });
    }
  }

  render() {
    const {
      userCount,
      groupName,
      avatarUrl,
      createdAt
    } = this.state;

    const rightLabel = (
      <View style={styles.iconMenuContainer}>
        <Image source={require('img/icons/icon_add_user.png')} style={styles.iconMenu} />
      </View>
    );
    return (
      <View style={styles.wrap}>
        <SimpleTopNav
          centerLabel="Group Info"
          leftAction={this.props.routeBack}
          iconBack={true}
          color={WHITE}
          gradientColor={'green'}
          rightLabel={this.props.isAdmin ? rightLabel : null}
          rightAction={this.addUser}
        />
        <View style={styles.wrap}>
          <GroupInformation
            avatarUrl={avatarUrl}
            groupName={groupName}
            createdAt={createdAt}
            userCount={userCount}
            onAvatarEdit={this.onAvatarEdit}
            onRemoveAvatar={this.removeAvatarURL}
            changeGroupName={this.changeGroupName}
            onGroupNameBlur={this.saveInformation}
            isAdmin={this.props.isAdmin}
          />
          <GroupUsersList
            users={this.state.users}
          />
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.leaveGroup} onPress={this.confirmLeaveGroup}>
              <AuxText style={styles.labelLeave} upperCase={false}>Leave Group</AuxText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default connectFeathers(GroupEditContainer);
