import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  InteractionManager,
  Linking,
  RefreshControl,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';
import { Message, SendRow, Loading, KeyboardSpacing, SimpleTopNav } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { GREEN } from 'AppColors';
import { styles } from './styles';
import { MESSAGE_SERVICE, GROUP_USER_SERVICE, GROUP_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { LabelText } from 'AppFonts';

class MessageContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    threadId: PropTypes.number,
    feathers: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool,
    hidden: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      messages: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loading: !!props.threadId,
      hidden: props.hidden,
      totalMessages: 0,
      $skip: 0,
      refreshing: false,
      renderKeyboard: false,
      title: ''
    };
    this.threadId = props.threadId;
    this.messages = [];
    this.renderRow = ::this.renderRow;
    this.renderFooter = ::this.renderFooter;
    this.getMessages = ::this.getMessages;
    this.onCreated = ::this.onCreated;
    this.routeLink = ::this.routeLink;
    this.insertMessage = ::this.insertMessage;
    this.onKeyboardUpdated = ::this.onKeyboardUpdated;
    this.scrollToBottom = ::this.scrollToBottom;
    this.onLayout = ::this.onLayout;
    this.handleScroll = ::this.handleScroll;
    this.onRefresh = ::this.onRefresh;
    this.onEndReached = ::this.onEndReached;
    this.onAppStateChanged = ::this.onAppStateChanged;
    this.routeGroupEdit = ::this.routeGroupEdit;
    this.getGroupInformation = ::this.getGroupInformation;
    this.getMessagesPromise = null;
    this.getGroupInformationPromise = null;
    this.messageListView = null;
    this.scrollViewHeight = 0;
    this.scrollContentSize = 0;
    this.forceScrollBottom = true;
    this.flagEndReached = false;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getGroupInformation();
      this.getMessages();
    });
  }

  componentDidMount() {
    this.flagMounted = true;
    this.props.feathers.service(MESSAGE_SERVICE).on('created', this.onCreated);
    this.props.feathers.service(GROUP_SERVICE).on('patched', this.getGroupInformation);
    AppState.addEventListener('change', this.onAppStateChanged);
    this.updateUserStatus(true);
  }

  componentWillUnmount() {
    this.flagMounted = false;
    this.props.feathers.service(MESSAGE_SERVICE).off('created', this.onCreated);
    this.props.feathers.service(GROUP_SERVICE).on('patched', this.getGroupInformation);
    if (this.getMessagesPromise) {
      this.getMessagesPromise.cancel();
    }
    if (this.getGroupInformationPromise) {
      this.getGroupInformationPromise.cancel();
    }
    this.getMessagesPromise = null;
    this.getGroupInformationPromise = null;
    AppState.removeEventListener('change', this.onAppStateChanged);
    this.updateUserStatus(false);
    this.onCreated = null;
  }

  onAppStateChanged(status) {
    this.updateUserStatus(status === 'active');
  }

  onCreated(message) {
    if (this.flagMounted) {
      if (this.onCreated && parseInt(message.groupId) === parseInt(this.threadId)) {
        if (this.messages.length === 0) {
          message.initGroupMessage = true;
        }
        this.messages = this.messages.concat(message);
        this.forceScrollBottom = true;
        this.setState({ messages: this.state.messages.cloneWithRows(this.messages) });
      }
    }
  }

  onKeyboardUpdated(flagShow) {
    if (this.flagEndReached && !flagShow) {
      this.scrollToBottom();
    }
    this.flagEndReached = false;
  }

  onLayout(event) {
    this.scrollViewHeight = event.nativeEvent.layout.height;
  }

  onRefresh() {
    if (this.flagMounted) {
      this.setState({refreshing: true}, () => this.getMessages());
    }
  }
  onEndReached() {
    this.flagEndReached = true;
  }

  updateUserStatus(isActive) {
    const { feathers } = this.props;
    if (this.threadId) {
      const userId = feathers.get('user').id;
      const groupUserService = feathers.service(GROUP_USER_SERVICE);
      groupUserService.patch(null, { isActive }, { query: { userId, groupId: this.threadId } })
        .catch(err => AlertMessage.fromRequest(err));
    }
  }

  getGroupInformation() {
    const { feathers } = this.props;
    const threadId = this.threadId;
    if (threadId && this.flagMounted) {
      const groupService = feathers.service(GROUP_SERVICE);
      this.getGroupInformationPromise = makeCancelable(groupService.find({ query: { id: threadId } }));
      this.getGroupInformationPromise
        .promise
        .then(group => {
          if (group.data && group.data[0] && this.getGroupInformationPromise) {
            this.setState({
              title: group.data[0].name,
              hidden: group.data[0].hidden,
            });
          }
        })
        .catch(error => {
          AlertMessage.fromRequest(error);
        });
    }
  }

  getMessages() {
    const { feathers } = this.props;
    const threadId = this.threadId;
    const { $skip, totalMessages } = this.state;
    if (threadId && $skip <= totalMessages && this.flagMounted) {
      const messageService = feathers.service(MESSAGE_SERVICE);
      this.getMessagesPromise =
        makeCancelable(messageService.find({ query: { groupId: threadId, $skip } }));
      this.getMessagesPromise
      .promise
      .then(messages => {
        this.messages = this.messages.concat(messages.data);
        this.messages.sort((a, b) => {
          const x = a.createdAt;
          const y = b.createdAt;
          if (x < y) {
            return -1;
          }
          return x > y ? 1 : 0;
        });
        if (this.getMessagesPromise) {
          this.setState({
            messages: this.state.messages.cloneWithRows(this.messages),
            loading: false,
            refreshing: false,
            $skip: this.state.$skip + messages.limit,
            totalMessages: messages.total,
          });
        }
      })
      .catch(error => {
        AlertMessage.fromRequest(error);
        this.setState({
          refreshing: false,
        });
      });
    } else {
      this.setState({ refreshing: false });
    }
  }

  handleScroll(event) {
    if (event.nativeEvent.contentOffset.y < 20 && this.state.$skip > 0) {
      this.getMessages();
    }
  }

  scrollToBottom(flagAnimation) {
    this.forceScrollBottom = false;
    requestAnimationFrame(() => {
      if (this.scrollViewHeight && this.scrollContentSize
        && this.scrollContentSize > this.scrollViewHeight) {
        const scrollDistance = this.scrollViewHeight - this.scrollContentSize;
        const scrollResponder = this.messageListView.getScrollResponder();
        scrollResponder.scrollTo({
          y: -scrollDistance,
          animated: flagAnimation
        });
      }
    });
  }

  insertMessage(content) {
    const { feathers } = this.props;
    const data = {
      groupId: this.threadId,
      content,
    };
    feathers.service(MESSAGE_SERVICE).create(data)
    .then()
    .catch(error => AlertMessage.fromRequest(error));
  }

  routeGroupEdit() {
    this.props.routeScene('GroupEditScene', {
      groupId: parseInt(this.threadId),
      isAdmin: this.props.isAdmin
    });
  }

  routeLink(path) {
    if (path.type === 'handle') {
      return Promise.resolve(path.user)
      .then(user => this.props.routeScene('ProfileScene', { userPass: user }));
    } else if (path.type === 'hashtag') {
      return this.props.routeScene('FeedScene', { hashtags: [path.hashtag] });
    }
    return Linking.openURL(path);
  }

  renderFooter() {
    return (
      <View
        style={styles.navbarSpacing}
        onLayout={(event) => {
          this.scrollContentSize = event.nativeEvent.layout.y;
          if (this.forceScrollBottom) {
            this.scrollToBottom();
          }
        }}
      />
    );
  }

  renderRow(message, sectionID, _rowID) {
    const { feathers, routeScene } = this.props;
    const rowID = parseInt(_rowID, 10);
    const prevMessage = rowID === 0 ? null : this.messages[rowID - 1];
    return (
      <Message
        message={message}
        prevMessage={prevMessage}
        userId={feathers.get('user').id}
        routeLink={this.routeLink}
        routeScene={routeScene}
      />
    );
  }

  renderMessages() {
    const { loading, messages, refreshing, renderKeyboard } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <View style={styles.wrap}>
        <ListView
          ref={view => this.messageListView = view}
          enableEmptySections={true}
          style={styles.listView}
          dataSource={messages}
          renderRow={this.renderRow}
          renderFooter={this.renderFooter}
          onLayout={this.onLayout}
          onEndReachedThreshold={0}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
        {renderKeyboard ? (
          <View style={styles.messageRow}>
            <SendRow
              insertMessage={this.insertMessage}
              autoFocus={true}
              onBlur={() => this.setState({ renderKeyboard: false })}
            />
            <KeyboardSpacing
              enableAndroid={true}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ renderKeyboard: true })}
            style={styles.keyboardButtonWrap}
          >
            <Image source={require('img/icons/icon_keyboard.png')} style={styles.keyboardButton} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    const { routeBack } = this.props;
    let rightLabel = (
      <View style={styles.iconMenuContainer}>
        <Image source={require('img/icons/icon_option_menu.png')} style={styles.iconMenu} />
      </View>
    );
    if (!this.threadId || this.state.hidden) {
      rightLabel = null;
    }
    return (
      <View style={styles.wrap}>
        <SimpleTopNav
          gradientColor={'green'}
          leftAction={() => routeBack()}
          iconBack={true}
          centerLabel={this.state.title}
          rightLabel={rightLabel}
          rightAction={rightLabel && this.routeGroupEdit}
        />
        {this.renderMessages()}
      </View>
    );
  }
}

export default connectFeathers(MessageContainer);
