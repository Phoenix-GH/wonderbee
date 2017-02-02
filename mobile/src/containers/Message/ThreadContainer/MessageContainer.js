import React, { Component, PropTypes } from 'react';
import {
  InteractionManager,
} from 'react-native';
import SwipeableListView from 'SwipeableListView';
import { connectFeathers } from 'AppConnectors';
import { ThreadList, Loading } from 'AppComponents';
import { GROUP_SERVICE, MESSAGE_SERVICE } from 'AppServices';
import { makeCancelable, AlertMessage } from 'AppUtilities';

class MessageContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    selectMode: PropTypes.bool.isRequired,
    updateUnreadMessageCount: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      threads: SwipeableListView.getNewDataSource(),
      loading: true,
      refreshing: false,
    };
    this.threads = [];
    this.deleteThread = ::this.deleteThread;
    this.getThreads = ::this.getThreads;
    this.getMoreThreads = ::this.getMoreThreads;
    this.updateRead = ::this.updateRead;
    this.deleteThreads = ::this.deleteThreads;
    this.selectAllThread = ::this.selectAllThread;
    this.selectOption = ::this.selectOption;
    this.onRefresh = ::this.onRefresh;
    this.onCreated = ::this.onCreated;
    this.getThreadPromise = null;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getThreads();
    });
  }

  componentDidMount() {
    this.props.feathers.service(MESSAGE_SERVICE).on('created', this.onCreated);
    this.props.feathers.service(GROUP_SERVICE).on('patched', this.onRefresh);
  }

  componentWillUnmount() {
    this.props.feathers.service(MESSAGE_SERVICE).off('created', this.onCreated);
    this.props.feathers.service(GROUP_SERVICE).off('patched', this.onRefresh);
    if (this.getThreadPromise) {
      this.getThreadPromise.cancel();
    }
  }

  onCreated(message) {
    //  do something
    this.onRefresh();
  }

  onRefresh() {
    this.setState({ refreshing: true }, () => this.getThreads());
  }

  getThreads() {
    const { feathers } = this.props;
    const groupService = feathers.service(GROUP_SERVICE);
    this.getThreadPromise = makeCancelable(groupService.find());
    this.getThreadPromise
    .promise
    .then(threads => {
      this.threads = threads.data;
      let totalUnreadCount = 0;
      this.threads.forEach(({ unreadCount }) => (totalUnreadCount += unreadCount));
      this.props.updateUnreadMessageCount(totalUnreadCount);
      this.setState({
        threads: this.state.threads.cloneWithRowsAndSections({ s1: threads.data }),
        loading: false,
        refreshing: false,
      });
    })
    .catch(error => {
      AlertMessage.fromRequest(error);
      this.setState({
        refreshing: false,
      });
    });
  }

  getMoreThreads() {
    if (this.state.threads.length > this.state.limit - 3) {
      this.setState({
        limit: this.state.limit + 10,
        loading: true,
      });
      return this.getThreads();
    }
    return null;
  }

  selectOption(threadId) {
    this.threads = this.threads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          isSelected: !thread.isSelected,
        };
      }
      return { ...thread };
    });
    this.setState({ threads: this.state.threads.cloneWithRowsAndSections({ s1: this.threads }) });
  }

  deleteThread(threadId) {
    const { feathers } = this.props;
    feathers.service(GROUP_SERVICE)
      .patch(threadId, { requestType: 'leaveGroup' })
      .then(() => {
        this.threads = this.threads.filter(thread => thread.id !== threadId);
        this.setState({
          threads: this.state.threads.cloneWithRowsAndSections({ s1: this.threads }),
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  updateRead(thread) {
    let totalUnreadCount = 0;
    this.threads = this.threads.map((item) => {
      if (thread.id === item.id) {
        item.unreadCount = 0;
      }
      totalUnreadCount += item.unreadCount;
      return { ...item };
    });
    this.props.updateUnreadMessageCount(totalUnreadCount);
    this.setState({
      threads: this.state.threads.cloneWithRowsAndSections({ s1: this.threads })
    })
    this.props.feathers.service(GROUP_SERVICE).patch(thread.id, { requestType: 'updateRead' });
    this.props.routeScene('MessageScene', { thread });
  }

  selectAllThread() {
    this.threads = this.threads.map(thread => ({
      ...thread,
      isSelected: true,
    }));
    this.setState({ threads: this.state.threads.cloneWithRowsAndSections({ s1: this.threads }) });
  }

  deleteThreads() {
    const threadIds = [];
    let threads = this.threads.concat();
    threads.forEach((thread) =>
      thread.isSelected === true && threadIds.push(thread.id)
      && this.deleteThread(thread.id, true)
    );

    threads = threads.filter(thread =>
      threadIds.indexOf(thread.id) === -1
    );
    const newArray = threads.map((thread) => ({ ...thread, deleted: false }));
    this.setState({
      threads: this.state.threads.cloneWithRowsAndSections({ s1: newArray }),
    });
  }

  render() {
    const { threads, refreshing } = this.state;
    if (this.loading) {
      return <Loading />;
    }
    return (
      <ThreadList
        threads={threads}
        selectMode={this.props.selectMode}
        getMoreThreads={this.getMoreThreads}
        updateRead={this.updateRead}
        deleteThread={this.deleteThread}
        selectOption={this.selectOption}
        refreshing={refreshing}
        onRefresh={this.onRefresh}
      />
    );
  }

}

export default connectFeathers(MessageContainer, { withRef: true });
