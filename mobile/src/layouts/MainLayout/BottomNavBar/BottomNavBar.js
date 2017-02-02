import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { styles } from './styles';

const renderCountArea = () => {
  const notificationCount = 0;
  const messageCount = 0;
  return (
    <View style={styles.countContainer}>
      {messageCount > 0 &&
        <View style={[styles.count, styles.messageCount]}>
          <LabelText style={styles.labelCount}>{messageCount}</LabelText>
        </View>
      }
      {notificationCount > 0 && messageCount > 0 &&
        <View style={{ flex: 1 }} />
      }
      {notificationCount > 0 &&
        <View style={[styles.count, styles.notificationCount]}>
          <LabelText style={styles.labelCount}>{notificationCount}</LabelText>
        </View>
      }
    </View>
  );
};
export function BottomNavBar({
  routeFeed,
  routeProfile,
  routePost,
  routeThread,
  routeHive,
  activeScene,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={routeHive} style={styles.button}>
        <Image
          source={activeScene === 'HiveHomeScene' ? require('img/icons/icon_nav_feed_selected.png')
            : require('img/icons/icon_nav_feed.png')}
          style={styles.iconNavFeed}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={routeFeed} style={styles.button}>
        <Image
          source={activeScene === 'FeedScene' ? require('img/icons/icon_nav_list_selected.png')
            : require('img/icons/icon_nav_list.png')}
          style={styles.iconHive}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={routePost} style={styles.buttonPost}>
        <Image
          source={require('img/icons/icon_nav_post.png')}
          style={ styles.iconNavPost }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={routeThread} style={styles.button}>
        <Image
          source={activeScene === 'ThreadScene' ? require('img/icons/icon_nav_message_selected.png')
            : require('img/icons/icon_nav_message.png')}
          style={styles.iconMessage}
        />
        {renderCountArea()}
      </TouchableOpacity>
      <TouchableOpacity onPress={routeProfile} style={styles.button}>
        <Image
          source={activeScene === 'ProfileScene' ? require('img/icons/icon_profile_selected.png')
            : require('img/icons/icon_profile.png')}
          style={styles.iconProfile}
        />
      </TouchableOpacity>
    </View>
  );
}

BottomNavBar.propTypes = {
  routeFeed: PropTypes.func.isRequired,
  routeProfile: PropTypes.func.isRequired,
  routePost: PropTypes.func.isRequired,
  routeThread: PropTypes.func.isRequired,
  routeHive: PropTypes.func.isRequired,
  activeScene: PropTypes.string.isRequired,
};
