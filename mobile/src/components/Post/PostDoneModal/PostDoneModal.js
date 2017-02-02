import React, { Component, PropTypes } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  PanResponder,
  Slider,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import moment from 'moment';
import _ from 'lodash';
import { EmojiKeyboard } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { dismissKeyboard } from 'AppUtilities';
import { LabelText } from 'AppFonts';
import { EMOJI_SERVICE } from 'AppServices';
import { GREEN, BLUE, WHITE } from 'AppColors';
import { default as SearchUserOverlay } from './SearchUserOverlay';
import { styles } from './styles';

class PostDoneModal extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    render: PropTypes.bool.isRequired,
    numberOfImages: PropTypes.number.isRequired,
    previewImage: PropTypes.object,
    toggleVisible: PropTypes.func.isRequired,
    post: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      renderOverlay: false,
      votingType: 'voting',
      postTo: 'followers',
      description: '',
      emojisSelected: [],
      timeSelected: 'days',
      days: 7,
      hours: 0,
      minutes: 0,
      usersSelected: [],
    };
    this.addEmoji = ::this.addEmoji;
    this.cancelSave = ::this.cancelSave;
    this.saveEmojis = ::this.saveEmojis;
    this.toggleTo = ::this.toggleTo;
    this.toggleVoting = ::this.toggleVoting;
    this.toggleEmojis = ::this.toggleEmojis;
    this.toggleTime = ::this.toggleTime;
    this.toggleEmojiKeyboard = ::this.toggleEmojiKeyboard;
    this.cancelSearch = ::this.cancelSearch;
    this.doneSearch = ::this.doneSearch;
    this.handleDescriptionChange = ::this.handleDescriptionChange;
    this.setNewSlideValue = ::this.setNewSlideValue;
    this.renderTopBar = ::this.renderTopBar;
    this.renderButtons = ::this.renderButtons;
    this.renderSelectedEmojis = ::this.renderSelectedEmojis;
    this.renderSlider = ::this.renderSlider;
    this.getEmojis = ::this.getEmojis;
    this.selectUser = ::this.selectUser;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: dismissKeyboard,
    });
    this.minMaxValues = {
      days: {
        min: 0,
        max: 7,
      },
      hours: {
        min: 0,
        max: 23,
      },
      minutes: {
        min: 0,
        max: 59,
      },
    };
    this.emojisSelected = [];
    this.emojiPresets = {};
    this.emojiKeyboard = null;
    this.getEmojis();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  getEmojis() {
    const { feathers } = this.props;
    feathers.service(EMOJI_SERVICE).find({ query: { requestType: 'presets' } })
    .then(emojis => {
      this.emojiPresets = emojis;
      this.emojisSelected = _.cloneDeep(emojis.general);
      this.setState({
        emojisSelected: emojis.general,
      });
    })
    .catch(error => console.log(error));
  }

  setNewSlideValue(timeSelected, value) {
    const { hours, days } = this.state;
    const newState = { [timeSelected]: value };
    if (timeSelected !== 'minutes' && value === 0 && (hours === 0 || days === 0)) {
      newState.minutes = 1;
    }
    this.setState(newState);
  }

  addEmoji(emoji) {
    if (this.state.emojisSelected.length < 5) {
      this.setState({ emojisSelected: this.state.emojisSelected.concat(emoji) });
    }
  }

  cancelSearch() {
    this.setState({ renderOverlay: false });
  }

  cancelSave() {
    this.setState({ emojisSelected: this.emojisSelected }, () =>
      this.emojiKeyboard.getWrappedInstance().toggleVisible(false)
    );
  }

  saveEmojis() {
    this.emojisSelected = _.cloneDeep(this.state.emojisSelected);
    return this.emojiKeyboard.getWrappedInstance().toggleVisible();
  }

  doneSearch() {
    this.setState({ renderOverlay: false });
  }

  toggleTo(postTo) {
    this.setState({ postTo, renderOverlay: postTo === 'group' });
  }

  toggleVoting(votingType) {
    this.setState({ votingType });
  }

  handleDescriptionChange(description) {
    this.setState({ description });
  }

  toggleEmojis(key) {
    this.emojisSelected = _.cloneDeep(this.emojiPresets[key]);
    this.setState({ emojisSelected: this.emojiPresets[key] });
  }

  toggleTime(timeSelected) {
    this.setState({ timeSelected });
  }

  toggleEmojiKeyboard() {
    this.emojisSelected = _.cloneDeep(this.state.emojisSelected);
    this.setState({ emojisSelected: [] });
    return this.emojiKeyboard.getWrappedInstance().toggleVisible();
  }

  selectUser(id, exists) {
    const usersSelected = exists ?
      this.state.usersSelected.filter(user => id !== user) :
      this.state.usersSelected.concat(id);
    this.setState({ usersSelected });
  }

  renderTopBar() {
    const { postTo, usersSelected } = this.state;
    const topButtons = [
      {
        label: 'Followers',
        toParam: 'followers',
        buttonStyle: postTo === 'followers' && { backgroundColor: GREEN },
        labelStyle: postTo === 'followers' && { color: '#000' },
      },
      {
        label: 'Direct',
        toParam: 'group',
        buttonStyle: postTo === 'group' && { backgroundColor: BLUE },
        labelStyle: postTo === 'group' && { color: WHITE },
        rightSide: usersSelected.length > 0 && (
          <View style={styles.whiteLabel}>
            <LabelText style={styles.whiteLabelText}>{usersSelected.length}</LabelText>
          </View>
        ),
      },
    ];
    return (
      <View style={styles.row}>
        {topButtons.map((button, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.button, button.buttonStyle]}
            onPress={() => {
              this.cancelSave();
              this.toggleTo(button.toParam);
            }}
          >
            <View style={styles.row}>
              <LabelText style={button.labelStyle}>
                {button.label}
              </LabelText>
              {button.rightSide}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderButtons() {
    const { numberOfImages } = this.props;
    const { votingType } = this.state;
    const buttons = [
      {
        label: numberOfImages > 1 ? 'Voting' : 'Heat Map',
        onPressParam: 'voting',
        active: votingType === 'voting',
        activeButtonStyle: styles.activeHeatmapButton,
        activeLabelStyle: styles.activeHeatmapLabel
      },
      {
        label: 'Feedback',
        onPressParam: 'feedback',
        active: votingType === 'feedback',
        activeButtonStyle: styles.activeFeedbackButton,
        activeLabelStyle: styles.activeFeedbackLabel
      },
    ];
    return (
      <View style={[styles.row, styles.buttonRow]}>
        {buttons.map((button, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => this.toggleVoting(button.onPressParam)}
            style={[styles.votingButton, button.active && button.activeButtonStyle]}
          >
            <LabelText style={button.active && button.activeLabelStyle}>
              {button.label}
            </LabelText>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderSelectedEmojis(emojisSelected) {
    const renderMessage = () => (
      <View style={styles.emojiMessage}>
        <LabelText>Select at least 2 emojis</LabelText>
      </View>
    );
    return (
      <View style={[styles.row, styles.buttonRow]}>
        {emojisSelected.map((emoji, i) => (
          <Image key={i} source={{ uri: emoji.url }} style={styles.icon} />
        ))}
        {this.state.emojisSelected.length < 2 && renderMessage()}
      </View>
    );
  }

  renderEmojiGroups() {
    const buttons = [
      { label: 'General', setParam: 'general', renderEmojiIcon: true },
      { label: 'Rating', setParam: 'rating', renderEmojiIcon: true },
      { label: 'Yes | No', setParam: 'yesno', renderEmojiIcon: true },
      { label: 'Custom', setParam: 'custom', renderEmojiIcon: false },
    ];
    return (
      <View style={[styles.row, styles.buttonRow]}>
        {buttons.map((button, i) => (
          <TouchableOpacity
            key={i}
            onPress={
              () => (button.renderEmojiIcon ?
                this.toggleEmojis(button.setParam) :
                this.toggleEmojiKeyboard())
            }
          >
            <View style={styles.buttonInner}>
              <LabelText>{button.label}</LabelText>
              <View style={[styles.row, styles.groupIconRow]}>
                {button.renderEmojiIcon ? this.emojiPresets[button.setParam].map((emoji, j) => (
                  <Image key={j} style={styles.groupEmoji} source={{ uri: emoji.url }} />
                )) : (
                  <Image
                    source={require('img/icons/icon_posting_add.png')}
                    style={styles.groupEmoji}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderSlider() {
    const { timeSelected, days, hours } = this.state;
    const min = timeSelected === 'minutes' && days === 0 && hours === 0 ?
      1 : this.minMaxValues[timeSelected].min;
    return (
      <View style={styles.labelRow}>
        <Slider
          minimumValue={min}
          maximumValue={this.minMaxValues[timeSelected].max}
          step={1}
          onValueChange={value => this.setNewSlideValue(timeSelected, value)}
          value={this.state[timeSelected]}
          style={styles.slider}
        />
      </View>
    );
  }

  render() {
    const { render, previewImage, toggleVisible, post, numberOfImages } = this.props;
    const {
      description,
      emojisSelected,
      postTo,
      votingType,
      hours,
      days,
      minutes,
      renderOverlay,
      usersSelected,
    } = this.state;
    return (
      <Modal animationType="fade" visible={render}>
        {this.renderTopBar()}
        <View style={styles.flex} {...this.panResponder.panHandlers}>
          <View style={[styles.row, styles.postDescription]}>
            <View style={styles.postImageContainer}>
              {previewImage &&
                <Image
                  source={{ uri: previewImage.snappedSurface }}
                  style={styles.flex}
                  resizeMode="contain"
                />
              }
            </View>
            <TextInput
              style={styles.description}
              onFocus={this.cancelSave}
              multiline={true}
              placeholder="Write your caption..."
              value={description}
              blurOnSubmit={true}
              onChangeText={this.handleDescriptionChange}
              returnKeyType="done"
            />
          </View>
          {this.renderButtons()}
          {votingType === 'feedback' ? (
            <View>
              {emojisSelected.length > 0 && this.renderSelectedEmojis(emojisSelected)}
              <View style={styles.labelRow}>
                <LabelText>Select your feedback emojis:</LabelText>
              </View>
              {emojisSelected.length > 0 && this.renderEmojiGroups()}
            </View>
          ) : (
            <View>
              <View style={styles.labelRow}>
                <LabelText>{`${numberOfImages === 1 ? 'Heat Map' : ''} Voting Expires`}</LabelText>
              </View>
              <View style={styles.labelRow}>
                <View style={[styles.row, styles.numberRow]}>
                  <TouchableOpacity onPress={() => this.toggleTime('days')}>
                    <LabelText style={styles.number}>
                      {`0${days}`}
                    </LabelText>
                  </TouchableOpacity>
                  <LabelText style={styles.numberLabel}>Days</LabelText>
                  <TouchableOpacity onPress={() => this.toggleTime('hours')}>
                    <LabelText style={styles.number}>
                      {hours < 10 ? `0${hours}` : hours}
                    </LabelText>
                  </TouchableOpacity>
                  <LabelText style={styles.numberLabel}>Hours</LabelText>
                  <TouchableOpacity onPress={() => this.toggleTime('minutes')}>
                    <LabelText style={styles.number}>
                      {minutes < 10 ? `0${minutes}` : minutes}
                    </LabelText>
                  </TouchableOpacity>
                  <LabelText style={styles.numberLabel}>Minutes</LabelText>
                </View>
              </View>
              {this.renderSlider()}
            </View>
          )}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: votingType === 'feedback' ? WHITE : '#000',
                borderBottomColor: postTo === 'group' ? BLUE : GREEN,
              }
            ]}
          >
            <TouchableOpacity style={styles.buttonSimple} onPress={() => toggleVisible()}>
              <LabelText>Back</LabelText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSimple}
              onPress={() => post({
                visibility: postTo,
                description,
                voting: votingType !== 'feedback',
                emojiIds: emojisSelected.map(emj => emj.id),
                expiresAt: moment().add(days, 'day').add(hours, 'hour').add(minutes, 'minute').toDate(),
              })}
            >
              <LabelText
                style={{ color: votingType === 'feedback' ? '#000' : WHITE }}
              >
                Post
              </LabelText>
            </TouchableOpacity>
          </View>
        </View>
        {renderOverlay && (
          <SearchUserOverlay
            cancelSearch={this.cancelSearch}
            doneSearch={this.doneSearch}
            selectUser={this.selectUser}
            usersSelected={usersSelected}
          />
        )}
        <EmojiKeyboard
          ref={ref => this.emojiKeyboard = ref}
          addEmoji={this.addEmoji}
          cancelSave={this.cancelSave}
          saveEmojis={this.saveEmojis}
          disableSave={this.state.emojisSelected.length < 2}
        />
      </Modal>
    );
  }
}

export default connectFeathers(PostDoneModal);
