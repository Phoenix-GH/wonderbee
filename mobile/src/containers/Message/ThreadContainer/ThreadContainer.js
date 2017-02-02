import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { SimpleTopNav, ToggleButton } from 'AppComponents';
import { BLUE, LIGHT_GREEN, GREEN, WHITE } from 'AppColors';
import MessageContainer from './MessageContainer';
import NotificationContainer from './NotificationContainer';
import { connectFeathers } from 'AppConnectors';
import { AuxText, LabelText } from 'AppFonts';
import { styles } from './styles';

class ThreadContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 0,
      selectMode: false,
      unreadMessageCount: 0,
    };
    this.selectAll = ::this.selectAll;
    this.deleteItems = ::this.deleteItems;
    this.onTabSelected = ::this.onTabSelected;
    this.updateSelectMode = ::this.updateSelectMode;
    this.messageContainer = null;
    this.notificationContainer = null;
    this.updateUnreadMessageCount = ::this.updateUnreadMessageCount;
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  updateSelectMode() {
    if (this.state.selectedTab === 0) {
      this.setState({ selectMode: !this.state.selectMode });
    }
  }

  selectAll() {
    const { selectedTab } = this.state;
    if (selectedTab === 0) {
      this.messageContainer.getWrappedInstance().selectAllThread();
    }
  }

  deleteItems() {
    const { selectedTab } = this.state;
    if (selectedTab === 0) {
      this.messageContainer._ref.deleteThreads();
      this.setState({ selectMode: false });
    }
  }

  updateUnreadMessageCount(unreadMessageCount) {
    this.setState({ unreadMessageCount });
  }

  renderTabContent(selectedTab) {
    const { selectMode } = this.state;
    const { routeScene, routeBack } = this.props;
    if (selectedTab === 0) {
      return (
        <MessageContainer
          ref={(ref) => this.messageContainer = ref}
          selectMode={selectMode}
          routeScene={routeScene}
          routeBack={routeBack}
          updateUnreadMessageCount={this.updateUnreadMessageCount}
        />
      );
    }
    return (
      <NotificationContainer
        ref={(ref) => this.notificationContainer = ref}
        selectMode={selectMode}
        routeScene={routeScene}
        routeBack={routeBack}
      />
    );
  }

  renderDeletePanel() {
    return (
      <View style={styles.deletePanelContainer}>
        <TouchableOpacity style={ styles.deletePanelSelectAllView } onPress={this.selectAll}>
          <Image
            source={require('img/icons/icon_select_all_threads.png')}
            style={styles.iconSelectAllThread}
          />
        </TouchableOpacity>
        <TouchableOpacity style={ styles.deletePanelDeleteView } onPress={this.deleteItems}>
          <Image
            source={require('img/icons/icon_delete.png')}
            style={styles.iconDelete}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      selectedTab,
      selectMode,
      unreadMessageCount
    } = this.state;
    const leftLabel = selectedTab === 0 ? (
      <View style={ styles.leftLabelView }>
        {selectMode ?
          <AuxText style={styles.leftLabelText}>Cancel</AuxText>
          :
          <Image source={require('img/icons/icon_select_thread.png')} style={styles.iconSelectThread} />
        }
      </View>
    ) : <View />;
    const rightLabel = selectedTab === 0 ? (
      <View style={styles.rightLabelView} >
        <Image source={require('img/icons/icon_new_thread.png')} style={styles.iconNewThread} />
      </View>
    ) : <View />;
    const centerLabel = (
      <View>
        <LabelText style={styles.centerLabelText} fontSize={15}>Messages and Alerts</LabelText>
      </View>
    );
    const iconMessage = require('img/icons/icon_nav_message.png');
    const iconAlert = require('img/icons/icon_alert.png');
    const notificationCount = 0;
    const toggleButtons = [
      {
        text: `Messages (${unreadMessageCount})`,
        icon: <Image source={iconMessage} style={styles.toggleMessageIcon} />,
      },
      {
        text: `Alerts (${notificationCount})`,
        icon: <Image source={iconAlert} style={styles.toggleAlertIcon} />,
      }
    ];
    const toggleSelectedStyles = [
      { backgroundColor: LIGHT_GREEN, opacity: 0.8 },
      { backgroundColor: BLUE, opacity: 0.8 },
    ];

    return (
      <View style={styles.wrap}>
        <SimpleTopNav
          gradientColor={selectedTab === 0 ? 'green' : 'blue' }
          color={WHITE}
          leftLabel={leftLabel}
          rightLabel={rightLabel}
          leftAction={this.updateSelectMode}
          rightAction={selectedTab === 0 ? () => this.props.routeScene('ThreadCreateScene') : null}
          centerLabel={centerLabel}
        />
        {selectMode ?
          this.renderDeletePanel() :
          <ToggleButton
            options={toggleButtons}
            onSelect={this.onTabSelected}
            value={selectedTab}
            selectedStyles={toggleSelectedStyles}
          />
        }
        {this.renderTabContent(selectedTab)}
      </View>
    );
  }
}

export default connectFeathers(ThreadContainer);
