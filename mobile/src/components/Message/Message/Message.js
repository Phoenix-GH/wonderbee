import React, { PropTypes } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { UserAvatar } from 'AppComponents';
import { MessageText, MessageTime, MessageUsername, MessageDate, SystemMessage } from 'AppFonts';
import { styles } from './styles';

const checkShowDate = (message) => {
  let showDate = true;
  const date = moment(message.createdAt).format('LL');
  if (message.previousTime !== -1) {
    const previousDate = moment(message.previousTime).format('LL');
    if (date === previousDate) {
      showDate = false;
    }
  }
  return showDate;
};

const renderDate = (message) => {
  const date = moment(message.createdAt).format('LL');
  if (checkShowDate(message)) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.dateContainer}>
          <MessageDate fontSize={12} style={styles.labelDate}>
            {date}
          </MessageDate>
        </View>
      </View>
    );
  }
  return <View />;
};

const renderSystemMessage = (message) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.systemMessageContainer}>
        <SystemMessage fontSize={12} style={styles.labelDate}>
          {message.content}
        </SystemMessage>
      </View>
    </View>
  );
};

const renderTime = (message, isSender) => {
  const style = isSender ? styles.sendMessageInfo : styles.receiveMessageInfo;
  const time = moment(message.createdAt).format('LT');
  return (
    <View style={style}>
      <MessageTime style={styles.timeText}>{time}</MessageTime>
    </View>
  );
};

const renderUserName = (message, prevMessage, isSender) => {
  const style = isSender ? styles.sendMessageInfo : styles.receiveMessageInfo;
  const component = (
    <View style={style}>
      <MessageUsername style={styles.username}>
        {message.createdBy.username}
      </MessageUsername>
    </View>
  );
  if (checkShowDate(message)) {
    return component;
  }
  if (isSender) {
    // check message is a first initial group message.
    if (message.previousTime === -1 || message.initGroupMessage) {
      return component;
    }
    return <View />;
  }
  if (prevMessage !== null && prevMessage.systemMessage === false
    && message.createdBy.username === prevMessage.createdBy.username) {
    return <View />;
  }
  return component;
};

const renderSenderMessage = (message, prevMessage) => {
  const length = message.content.length;
  const timeComponent = length < 30 ? null : renderTime(message, true);
  let messageComponent = (
    <MessageText style={styles.messageMultiLine}>{message.content}</MessageText>
  );
  if (length < 30) {
    messageComponent = (
      <View style={styles.messageTimeContainer}>
        <MessageText style={styles.message}>{message.content}</MessageText>
        <View style={styles.rowSep} />
        {renderTime(message, true)}
      </View>
    );
  }
  let flagShowBubble = true;
  if (prevMessage !== null && prevMessage.systemMessage === false
    && message.createdBy.username === prevMessage.createdBy.username) {
    if (!checkShowDate(message)) {
      flagShowBubble = false;
    }
  }
  return (
    <View style={[styles.wrap, styles.end]}>
      <View style={styles.row}>
        <View style={[styles.wrap, styles.end]}>
          { flagShowBubble && <View style={styles.sendBubble1} /> }
          { flagShowBubble && <View style={styles.sendBubble2} /> }
          <View style={[styles.messageArea, styles.senderMessageArea]}>
            {messageComponent}
            {timeComponent}
          </View>
        </View>
      </View>
    </View>
  );
};

const renderReceiverMessage = (message, prevMessage, routeScene) => {
  const length = message.content.length;
  const timeComponent = length < 30 ? null : renderTime(message, false);
  let messageComponent = (
    <MessageText style={styles.messageMultiLine}>{message.content}</MessageText>
  );
  if (length < 30) {
    messageComponent = (
      <View style={styles.messageTimeContainer}>
        <MessageText style={styles.message}>{message.content}</MessageText>
        <View style={styles.rowSep} />
        {renderTime(message, false)}
      </View>
    );
  }
  let flagRenderAvatar = true;
  if (prevMessage !== null && !prevMessage.systemMessage
    && message.createdBy.username === prevMessage.createdBy.username) {
    if (!checkShowDate(message)) {
      flagRenderAvatar = false;
    }
  }
  return (
    <View style={[styles.wrap, styles.start]}>
      <View style={styles.row}>
        <View style={[styles.wrap, styles.start]}>
          {renderUserName(message, prevMessage)}
          { flagRenderAvatar && <View style={styles.receiveBubble1} /> }
          { flagRenderAvatar && <View style={styles.receiveBubble2} /> }
          <View style={[styles.messageArea, styles.receiveMessageArea]}>
            {messageComponent}
            {timeComponent}
          </View>
        </View>
        <View style={styles.recvAvatarContainer}>
          { flagRenderAvatar &&
            <UserAvatar
              onPress={() => routeScene('ProfileScene', { userPass: message.createdBy })}
              avatarUrl={message.createdBy.avatarUrl}
              size={30}
              iconStyle={{ width: 13, height: 15 }}
            />
          }
        </View>
      </View>
    </View>
  );
};

export function Message({ userId, message, prevMessage, routeScene }) {
  if (message && parseInt(message.userId, 10) === 0) {
    message.systemMessage = true; // eslint-disable-line no-param-reassign
  }
  if (prevMessage && parseInt(prevMessage.userId, 10) === 0) {
    prevMessage.systemMessage = true; // eslint-disable-line no-param-reassign
  }
  return (
    <View style={styles.container}>
      {renderDate(message)}
      {message.systemMessage && renderSystemMessage(message)}
      {
        !message.systemMessage &&
        (message.createdBy.id === userId ?
          renderSenderMessage(message, prevMessage) :
          renderReceiverMessage(message, prevMessage, routeScene)
        )
      }
    </View>
  );
}

Message.propTypes = {
  userId: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
  prevMessage: PropTypes.object,
  routeScene: PropTypes.func,
};
