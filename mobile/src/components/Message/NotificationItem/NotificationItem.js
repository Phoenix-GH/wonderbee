import React, { PropTypes } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, View, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { styles } from './styles';
import { UserAvatar } from 'AppComponents';

export const NotificationItem = ({
  notification,
  updatedAt,
  routeNotification,
}) => {
  const { type, createdBy, content } = notification;
  let message = '';
  if (type === 'share') {
    message = `${createdBy.name} shared post to you.`;
  } else if (type === 'post_vote') {
    message = `${createdBy.name} vote your post.`;
  } else if (type === 'image_vote') {
    message = `${createdBy.name} vote image on your post.`;
  } else if (type === 'comment_vote_up') {
    message = `${createdBy.name} vote up your comment.`;
  } else if (type === 'comment_vote_down') {
    message = `${createdBy.name} vote down your comment.`;
  } else if (type === 'reply_vote_up') {
    message = `${createdBy.name} vote up your reply.`;
  } else if (type === 'reply_vote_down') {
    message = `${createdBy.name} vote down your reply.`;
  } else if (type === 'comment') {
    message = `${createdBy.name} comment your post.`;
  } else if (type === 'reply') {
    message = `${createdBy.name} reply your comment.`;
  } else if (type === 'following') {
    message = `${createdBy.name} is following you now`;
  } else if (type === 'message') {
    message = `${createdBy.name} sent you message`;
  }
  return (
    <TouchableWithoutFeedback
      onPress={routeNotification}
      style={[styles.container, styles.row]}
    >
      <View style={[styles.container, styles.row]}>
        <View style={[styles.container, styles.row, { flex: 1 }]}>
          <View style={[styles.container, styles.row, styles.notificationContainer]}>
            <TouchableOpacity>
              <UserAvatar
                avatarUrl={createdBy.avatarUrl}
                size={30}
                iconStyle={{ width: 13, height: 15 }}
              />
            </TouchableOpacity>
            <View style={[styles.wrap, styles.row]}>
              <View style={ styles.messageView }>
                <View style={[styles.row, { flex: 1 }]}>
                  <LabelText style={styles.participants} fontSize={14}>
                    {createdBy.username}
                  </LabelText>
                  <LabelText style={styles.updatedAt}>
                    {updatedAt}
                  </LabelText>
                </View>
                <View style={[styles.row, { marginTop: 3 }]}>
                  <LabelText style={styles.content} fontSize={12} numberOfLines={3}>
                    {content}
                  </LabelText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

NotificationItem.propTypes = {
  updatedAt: PropTypes.string.isRequired,
  notification: PropTypes.object.isRequired,
  routeNotification: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
};
