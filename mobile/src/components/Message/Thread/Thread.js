import React, { PropTypes } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, View, Image } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { AUX_TEXT, YELLOW } from 'AppColors';
import { LabelText } from 'AppFonts';
import { styles } from './styles';

const renderCheckIcon = () => (
  <Image source={require('img/icons/icon_check_vote.png')} style={styles.iconCheck} />
);

const renderUnreadCount = (count) => (
  <View style={styles.countArea}>
    <View style={styles.countContainer}>
      <LabelText style={styles.labelCount}>{count}</LabelText>
    </View>
  </View>
);
export function Thread({
  thread,
  routeMessages,
  selectOption,
  selectMode,
  isSelected
}) {
  const color = thread.read ? { color: AUX_TEXT } : null;
  const unreadCount = thread.unreadCount;
  return (
    <TouchableWithoutFeedback
      style={[styles.container, styles.row]}
    >
      <View style={[styles.container, styles.row]}>
        {selectMode &&
          <TouchableOpacity style={styles.optionContainer} onPress={selectOption}>
            <View style={[styles.optionSelect]}>
              {isSelected && renderCheckIcon()}
            </View>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={[styles.container, styles.row, { flex: 1 }]}
          onPress={routeMessages}
        >
          <View style={ styles.readIndicatorView }>
            {unreadCount > 0 && <View style={styles.readIndicator} />}
          </View>
          <View style={[styles.container, styles.row, styles.threadContainer]}>
            <TouchableOpacity style={{ overflow: 'hidden' }}>
              <UserAvatar
                avatarUrl={thread.avatarUrl}
                size={30}
                iconStyle={{ width: 13, height: 15 }}
              />
            </TouchableOpacity>
            {unreadCount > 0 && renderUnreadCount(unreadCount)}
            <View style={styles.wrap}>
              <View style={[styles.row]}>
                <LabelText style={styles.participants} fontSize={12}>
                  {thread.name || thread.involvedString}
                </LabelText>
                <LabelText style={styles.updatedAt}>{thread.updateAtString}</LabelText>
              </View>
              <View style={[styles.row, { flex: 1, marginTop: 3 }]}>
                <View style={ styles.lastMessageView }>
                  <LabelText style={[styles.lastMessage, color]} fontSize={12} numberOfLines={3}>
                    {thread.lastMessage}
                  </LabelText>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

Thread.propTypes = {
  thread: PropTypes.object.isRequired,
  routeMessages: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
};
