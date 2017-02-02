import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, ListView, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { EMOJI_SERVICE } from 'AppServices';
import { LabelText } from 'AppFonts';
import { GRAY, LIGHT_GRAY, WHITE } from 'AppColors';
import { connectFeathers } from 'AppConnectors';
const keyboardHeight = WINDOW_HEIGHT / 3.1;
const rowHeight = keyboardHeight / 6;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: keyboardHeight,
    width: WINDOW_WIDTH,
    top: WINDOW_HEIGHT,
    left: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: rowHeight,
  },
  categories: {
    backgroundColor: '#E3E6E6',
  },
  categoryIcon: {
    width: 10,
    height: 10,
    tintColor: LIGHT_GRAY,
  },
  bottomRow: {
    backgroundColor: WHITE
  },
  swiper: {
    backgroundColor: LIGHT_GRAY,
  },
  emojiRow: {
    justifyContent: 'flex-start',
  },
  emoji: {
    height: rowHeight - 5,
    width: rowHeight - 5,
    marginVertical: 2.5,
    marginHorizontal: 7.5
  },
});

class EmojiKeyboard extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    addEmoji: PropTypes.func.isRequired,
    cancelSave: PropTypes.func.isRequired,
    saveEmojis: PropTypes.func.isRequired,
    disableSave: PropTypes.bool.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      translateY: new Animated.Value(0),
      people: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      nature: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      foods: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      activity: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      places: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      objects: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      symbols: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      flags: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      activeCategory: 'people',
      render: false,
    };
    this.getEmojis = ::this.getEmojis;
    this.toggleVisible = ::this.toggleVisible;
    this.renderEmojiRow = ::this.renderEmojiRow;
    this.onSwiperEnd = ::this.onSwiperEnd;
    this.dismissKeyboard = ::this.dismissKeyboard;
    this.keyboardShown = false;
    this.categories = [];
    this.getEmojis();
  }

  onSwiperEnd(e, state) {
    if (this.categories[state.index] !== this.state.activeCategory) {
      this.setState({ activeCategory: this.categories[state.index] });
    }
  }

  getEmojis() {
    const { feathers } = this.props;
    feathers.service(EMOJI_SERVICE).find({ query: { requestType: 'all' } })
    .then(emojis => {
      this.categories = emojis.categories;
      const newState = {};
      this.categories.forEach(key => {
        newState[key] = this.state[key].cloneWithRows(emojis[key]);
      });
      this.setState({ ...newState, render: true });
    })
    .catch(error => console.log(error))
    .done();
  }

  toggleVisible(alwaysToggle = true) {
    if (!alwaysToggle && !this.keyboardShown) {
      return null;
    }
    return Animated.timing(
      this.state.translateY, {
        toValue: this.keyboardShown ? 0 : -keyboardHeight,
        duration: 300,
      }
    ).start(() => this.keyboardShown = !this.keyboardShown);
  }

  dismissKeyboard() {
    if (this.keyboardShown) {
      this.toggleVisible();
    }
  }

  renderEmojiRow(emoji) {
    const { addEmoji } = this.props;
    return (
      <View style={[styles.row, styles.emojiRow]}>
        {emoji.map((emj, i) => (
          <TouchableOpacity key={i} onPress={() => addEmoji(emj)}>
            <Image source={{ uri: emj.url }} style={styles.emoji} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  render() {
    const { translateY, activeCategory, render } = this.state;
    const { disableSave } = this.props;
    const active = activeCategory && { tintColor: GRAY };
    return render && (
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <View style={[styles.row, styles.categories]}>
          {this.categories.map((cat, i) => (
            <Image
              key={i}
              // source={cat.url}
              source={{ uri: 'https://cdn4.iconfinder.com/data/icons/defaulticon/icons/png/256x256/media-shuffle.png' }}
              style={[styles.categoryIcon, active]}
            />
          ))}
          <Image
            source={require('img/icons/icon_count_down.png')}
            style={[styles.categoryIcon, active]}
          />
        </View>
        <Swiper
          style={styles.swiper}
          height={rowHeight * 4}
          showsPagination={false}
          onMomentumScrollEnd={this.onSwiperEnd}
        >
          {this.categories.map((cat, i) => (
            <ListView
              key={i}
              dataSource={this.state[cat]}
              renderRow={this.renderEmojiRow}
              enableEmptySections={true}
            />
          ))}
        </Swiper>
        <View style={[styles.row, styles.bottomRow]}>
          <TouchableOpacity onPress={this.props.cancelSave}>
            <LabelText>Cancel</LabelText>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.saveEmojis}>
            <LabelText style={disableSave && { color: LIGHT_GRAY }}>Save</LabelText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

export default connectFeathers(EmojiKeyboard, { withRef: true });
