import React, { PropTypes } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { TextExtraBold } from 'AppFonts';
import { BLUE, DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 50,
    width: WINDOW_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    width: WINDOW_WIDTH,
    bottom: 45,
  },
  icon: {
    height: 45,
    width: 45,
  },
  buttonInner: {
    alignItems: 'center',
  },
  checkWrap: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    height: 15,
    width: 15,
  },
  bubble: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteCountText: {
    fontSize: 16,
    color: DARK_GRAY,
    backgroundColor: 'transparent',
    top: -2,
  },
  highestBubble: {
    height: 60,
    width: 60,
  },
  highest: {
    color: BLUE,
    fontSize: 20,
  },
  voted: {
    bottom: 10,
  },
});

const getVotes = (emojiId, votes) => {
  if (votes.votesByEmoji.length > 0) {
    const vote = votes.votesByEmoji.filter(tmp => tmp.emojiId === emojiId.toString());
    return vote.length > 0 ? Math.floor(vote[0].votePercent * 100) : 0;
  }
  return 0;
};

const isHighest = (emojiId, votes) => (
  votes.votesByEmoji.filter(v => v.emojiId === emojiId.toString())[0].highest || false
);

export function VoteIcons({
  votePost,
  voted,
  votes,
  emojis,
  translateY,
  left,
}) {
  return (
    <Animated.View style={{ left, transform: [{ translateY }] }}>
      <View style={styles.row}>
        {voted && emojis.map((emj, i) => (
          <View
            key={i}
            style={[
              votes.userVotes.emojiId &&
              votes.userVotes.emojiId.toString() === emj.id.toString() &&
              styles.voted,
            ]}
          >
            <Image
              style={[
                styles.bubble,
                isHighest(emj.id, votes) && styles.highestBubble,
              ]}
              source={require('img/icons/feed-post/icon_small_bubble.png')}
            >
              <TextExtraBold
                style={[
                  styles.voteCountText,
                  isHighest(emj.id, votes) && styles.highest
                ]}
              >
                {getVotes(emj.id, votes)}%
              </TextExtraBold>
            </Image>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {emojis.map((emj, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => votePost(emj.id)}
            style={[
              votes.userVotes.emojiId &&
              votes.userVotes.emojiId.toString() === emj.id.toString() &&
              styles.voted,
            ]}
          >
            <View style={styles.buttonInner}>
              <Image source={{ uri: emj.url }} style={styles.icon} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}
VoteIcons.propTypes = {
  votePost: PropTypes.func.isRequired,
  voted: PropTypes.bool.isRequired,
  votes: PropTypes.object.isRequired,
  emojis: PropTypes.array.isRequired,
  translateY: PropTypes.object.isRequired,
  left: PropTypes.object.isRequired,
  imageHeight: PropTypes.number.isRequired,
};
