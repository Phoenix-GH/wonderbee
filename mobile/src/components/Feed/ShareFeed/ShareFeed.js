import React, { Component, PropTypes } from 'react';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ListView,
  Text,
  LayoutAnimation,
  Clipboard,
} from 'react-native';
import { HexagonImage, SocialList, Separator } from 'AppComponents';
import { ActionButton, FullWidthButton, FlexButton } from 'AppButtons';
import { LabelText } from 'AppFonts';
import { YELLOW } from 'AppColors';
import { connectFeathers } from 'AppConnectors';
import { AlertMessage, dismissKeyboard } from 'AppUtilities';
import { API } from 'AppConstants';
import { styles, hexagonStates } from './styles';
import {
  SEARCH_SERVICE,
  NOTIFICATION_SERVICE
} from 'AppServices';

class ShareFeed extends Component {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    feathers: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    dimBackground: PropTypes.bool.isRequired,
    bottom: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.onClose = ::this.onClose;
    this.state = {
      sendUserName: '',
      users: [],
      skipped: 0,
      flag: '',
      copiedToClipboard: false,
      availableFlags: ['Nudity', 'Violence', 'Spam', 'Copyright', 'Other'],
    };

    this.userDataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.isSelected !== row2.isSelected,
    });
    this.postURL = API.POSTS.ID(props.postId);
    this.flagPickerRef = null;

    this.onChangeText = ::this.onChangeText;
    this.renderUserRow = ::this.renderUserRow;
    this.onSocialClick = ::this.onSocialClick;
    this.fetchMoreUsers = ::this.fetchMoreUsers;
    this.selectUser = ::this.selectUser;
    this.isActiveSubmit = ::this.isActiveSubmit;
    this.sharePostToUsers = ::this.sharePostToUsers;
    this.changeFlag = ::this.changeFlag;
    this.toggleFlagPicker = ::this.toggleFlagPicker;
    this.renderCommonActions = ::this.renderCommonActions;
    this.copyToClipboard = ::this.copyToClipboard;
  }

  toggleFlagPicker() {
    dismissKeyboard();
    this.flagPickerRef && this.flagPickerRef.toggle();
  }

  onChangeText(sendUserName) {
    const { feathers } = this.props;
    const currentUser = feathers.get('user');
    const searchService = feathers.service(SEARCH_SERVICE);

    if (!sendUserName.length) {
      return this.setState({ sendUserName, users: [], skipped: 0 });
    }
    this.setState({ sendUserName, skipped: 0 });

    LayoutAnimation.easeInEaseOut();

    searchService.create({
      query: sendUserName,
      lookInto: {
        users: {
          exclude: [currentUser.id]
        },
        searchType: 'like',
      },
      $limit: 10,
    })
      .then(({ users }) => this.setState({ users }))
      .catch(error => AlertMessage.fromRequest(error));
  }

  onSocialClick() {}

  onClose() {
    this.props.onClose();
  }

  copyToClipboard() {
    const { copiedToClipboard } = this.state;
    if (copiedToClipboard) {
      return;
    }
    Clipboard.setString(this.postURL);

    return this.setState({ copiedToClipboard: true });
  }

  changeFlag(flag) {
    this.setState({ flag });
  }

  fetchMoreUsers() {
    const { feathers } = this.props;
    const { skipped, sendUserName, users } = this.state;

    if (!users.length) {
      return null;
    }

    const searchService = feathers.service(SEARCH_SERVICE);
    const currentUser = feathers.get('user');

    this.setState({
      skipped: skipped + 10
    });
    return searchService.create({
      query: sendUserName,
      lookInto: {
        users: {
          exclude: [currentUser.id]
        },
        searchType: 'like',
      },
      $skip: skipped + 10,
      $limit: 10,
    })
      .then(nextUsers => {
        const _users = users.concat(nextUsers.users);
        this.setState({ users: _users });
      })
      .catch((err) => AlertMessage.fromRequest(err));
  }

  isActiveSubmit() {
    const { users } = this.state;
    return users.some(user => user.isSelected);
  }

  sharePostToUsers() {
    const { feathers } = this.props;
    const { users, flag } = this.state;
    const notificationService = feathers.service(NOTIFICATION_SERVICE);
    const selectedUsers = users.filter(user => user.isSelected);

    const promises = selectedUsers.map(user => (
      notificationService.create({
        userId: user._id,
        target: 'post',
        targetId: this.props.postId,
        type: !!flag ? flag : 'share'
      })
    ));

    Promise.all(promises)
      .catch(error => AlertMessage.fromRequest(error));

    this.onClose();
  }

  selectUser(id) {
    const { users: currentUsers } = this.state;
    const users = currentUsers.map(user => {
      if (user.id !== id) {
        return user;
      }
      return Object.assign({}, user, {
        isSelected: !user.isSelected,
      });
    });

    this.setState({ users });
  }

  renderUserRow(user) {
    const hexagonStyle = user.isSelected ? hexagonStates.selected : hexagonStates.default;
    return (
      <TouchableOpacity style={styles.userContainer} onPress={() => this.selectUser(user.id)}>
        <HexagonImage
          imageWidth={45}
          imageHeight={45}
          border={true}
          isHorizontal={true}
          size={40}
          imageSource={{ uri: user.avatarUrl }}
          {...hexagonStyle}
        />
        <LabelText style={styles.userLabel}>{user.name}</LabelText>
      </TouchableOpacity>
    );
  }

  renderCommonActions() {
    const { flag, copiedToClipboard } = this.state;

    return (
      <View style={styles.flagContainer}>
        <TouchableOpacity onPress={this.toggleFlagPicker}>
          {!!flag ? (
            <View style={styles.directionRow}>
              <Icon name={'flag'} size={20} />
              <Text style={styles.flagText}>{flag}</Text>
            </View>
          ) : (
            <Text style={styles.flagText}>Tap to select Flag</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={this.copyToClipboard}>
          <View style={styles.directionRow}>
            <Icon name={'content-copy'} size={20} color={copiedToClipboard && YELLOW} />
            <Text style={[
              styles.flagText,
              copiedToClipboard ? styles.yellow : {}
            ]}
            >
              Copy Share URL
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { flag, availableFlags, users } = this.state;
    const { dimBackground, bottom } = this.props;
    const userRows = this.userDataSource.cloneWithRows(users);
    const dimStyle = dimBackground ? styles.dimBackground : null;
    return (
      <Modal
        transparent={true}
        animationType={'fade'}
      >
        <KeyboardAvoidingView
          behavior={'position'}
          style={styles.flex}
          contentContainerStyle={styles.flex}
          keyboardVerticalOffset={-175}
        >
        <View style={[styles.container, dimStyle]}>
          <TouchableOpacity
            onPress={this.onClose}
            style={styles.modalTouchable}
          />
        </View>
        <View style={[styles.viewContainer, { bottom }]}>
          <View style={styles.searchContainer}>
            <Image
              source={require('img/icons/icon_search.png')}
              style={styles.modalSearchImage}
            />
            <TextInput
              style={styles.input}
              placeholder="Send to..."
              onChangeText={this.onChangeText}
              value={this.state.sendUserName}
            />
          </View>

          <View style={styles.userListContainer}>
            {users.length ? (
              <ListView
                enableEmptySections={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                dataSource={userRows}
                renderRow={this.renderUserRow}
                onEndReached={this.fetchMoreUsers}
              />
            ) : (
              <Text style={styles.typeToSearch}>Type to Search...</Text>
            )}
            {!users.length && (
              <Separator />
            )}
          </View>
          {this.renderCommonActions()}
          <View style={styles.actionButtons}>
            <ActionButton
              label="Cancel"
              onPress={this.onClose}
              style={[styles.button, styles.buttonLeft]}
            />
            <ActionButton
              label="Send"
              style={[styles.button, styles.buttonRight]}
              onPress={this.sharePostToUsers}
              isActive={this.isActiveSubmit()}
            />
          </View>
          <Picker
            ref={picker => this.flagPickerRef = picker}
            showDuration={300}
            showMask={true}
            pickerTitle="Select Share Flag"
            selectedValue={flag}
            pickerData={availableFlags}
            onPickerDone={(data) => this.changeFlag(data)}
            onPickerCancel={() => this.toggleFlagPicker()}
          />
        </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

export default connectFeathers(ShareFeed);
