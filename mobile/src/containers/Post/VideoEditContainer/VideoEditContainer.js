import React, { Component, PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Slider,
  Image,
} from 'react-native';
import _ from 'lodash';
import { styles } from './styles';
import { LabelText, TextSemiBold } from 'AppFonts';
import {
  VideoFilterBar,
  PostDoneModal,
  VideoPlayer,
  Loading,
} from 'AppComponents';
import { TextBold } from 'AppFonts';
import { WHITE } from 'AppColors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class VideoEditContainer extends Component {
  static propTypes = {
    routeBack: PropTypes.func.isRequired,
    replaceCurrentScene: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      toolbar: '',
      renderModal: false,
      renderLoading: false,
      previewImage: {},
    };

    this.post = ::this.post;
    this.toggleModalVisible = ::this.toggleModalVisible;
    this.setOption = ::this.setOption;
    this.renderToolbar = ::this.renderToolbar;
    this.renderNavbar = ::this.renderNavbar;
    this.setCoverPos = ::this.setCoverPos;
    this.setVideoPlay = ::this.setVideoPlay;
    this.setFilter = ::this.setFilter;
    this.rangeChangeStart = ::this.rangeChangeStart;
    this.rangeChange = ::this.rangeChange;
    this.rangeChangeFinish = ::this.rangeChangeFinish;

    this.video = _.cloneDeep(props.videos[0]);
    this.filter = 0;
    this.range = [0, 0];
    this.coverPos = 0;
    this.isPlaying = true;


    console.log(props.videos);
  }

  cancel() {
    switch (this.state.toolbar) {
      case 'filter':
        this.setFilter(this.filter);
        break;
      case 'trim':
        this.setRange(this.range, this.range[0]);
        break;
      default:
    }
    this.setOption('');
  }

  save() {
    switch (this.state.toolbar) {
      case 'filter':
        this.filter = this.currentValue;
        break;
      case 'trim':
        this.range = this.currentValue;
        if (this.coverPos<this.range[0] || this.coverPos>this.range[1]) {
          this.coverPos = this.range[0];
        }
        break;
      case 'cover':
        this.coverPos = this.currentValue;
        break;
      default:
    }
    this.setOption('');
  }

  exit() {
    Alert.alert(
      'Are you sure you want to exit?',
      'You will lose all of your progress',
      [
        { text: 'Cancel', onPress: () => null },
        { text: 'Confirm', onPress: () => {
            this.props.replaceCurrentScene('CameraScene');
          }
        },
      ],
    );
  }

  next() {
    this.sendToBridge({getCover:this.coverPos});
    this.setState({
      renderModal: true,
    });
  }

  post({ description, visibility, voting, emojiIds, expiresAt }) {

  }

  toggleModalVisible(renderModal = false) {
    this.setState({ renderModal });
  }

  setOption(toolbar) {
    if (toolbar === 'trim') {
      this.setRange(this.range);
    } else if (toolbar === 'cover') {
      this.setCoverPos(this.coverPos);
    }
    this.setVideoPlay(toolbar !== 'cover');
    this.setState({toolbar});
  }

  setVideoPlay(isPlaying) {
    this.isPlaying = isPlaying;
    this.sendToBridge(isPlaying ? {play:true} : {stop:true});
  }

  setFilter(index) {
    this.currentValue = index;
    this.sendToBridge({
      filter: index,
    });
  }

  setRange(range, frame) {
    this.currentValue = range;
    let data = {range};
    if (frame !== undefined) data.frame = frame;
    this.sendToBridge(data);
  }
  rangeChangeStart() {
    this.setVideoPlay(false);
  }
  rangeChange(values) {
    const frame = this.currentValue[0]==values[0] ? values[1] : values[0];
    this.setRange(values, frame);
  }
  rangeChangeFinish(values) {
    this.setRange(values, values[0]);
    this.setVideoPlay(true);
  }

  setCoverPos(value) {
    this.currentValue = value;
    this.sendToBridge({
      frame: value,
    });
  }

  onBridgeMessage(data) {
    switch (data.type) {
      case 'info':
        this.duration = data.duration;
        this.range = [0, Math.floor(data.range[1]*100)/100];
        break;
      case 'filterIcons':
        this.filterIcons = data.data;
        break;
      case 'coverImg':
        this.setState({
          previewImage: {snappedSurface: data.data}
        });
        break;
      default:
    }
  }

  sendToBridge(data) {
    this.refs.videoplayer.sendToBridge(JSON.stringify(data));
  }

  renderToolbar() {
    switch (this.state.toolbar) {
      case 'filter': {
        return (
          <View style={styles.toolbar}>
            <VideoFilterBar
              filterIcons={this.filterIcons}
              setFilter={this.setFilter}
            />
          </View>
        );
      }

      case 'trim': {
        return (
          <View style={[styles.toolbar, {marginTop:25, marginBottom:-25}]} >
            <MultiSlider
            ref='trimslider'
            values={this.range}
            min={0}
            max={this.duration}
            step={0.01}
            onValuesChangeStart={this.rangeChangeStart}
            onValuesChange={this.rangeChange}
            onValuesChangeFinish={this.rangeChangeFinish}
            />
          </View>
        );
      }

      case 'cover': {
        const sliderOptions = {
          minimumValue: this.range[0],
          maximumValue: this.range[1],
          step: 0.01,
          value: this.coverPos,
        };

        return (
          <View style={styles.toolbar}>
            <Slider
              style={styles.toolbarSlider}
              {...sliderOptions}
              onValueChange={this.setCoverPos}
            />
          </View>
        );
      }

      default: {
        const buttons = [
          { label: 'Filter', icon: require('img/icons/icon_posting_filter.png'), toolbar: 'filter' },
          { label: 'Trim', icon: require('img/icons/icon_posting_fit.png'), toolbar: 'trim' },
          { label: 'Cover', icon: require('img/icons/icon_posting_edit.png'), toolbar: 'cover' },
        ];
        return (
          <View style={styles.toolbar}>
            <View style={styles.toolbarOptions}>
              {buttons.map((button, i) => (
                <TouchableOpacity key={i} onPress={() => this.setOption(button.toolbar)}>
                  <View style={styles.toolbarButton}>
                    <Image source={button.icon} style={styles.toolbarIcon} />
                    <TextSemiBold>{button.label}</TextSemiBold>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }
    }
  }

  renderNavbar() {
    const navState = this.state.toolbar === '' ?
      { leftLabel:'Exit', leftFunc:this.exit, rightLabel:'Next', rightFunc:this.next } :
      { leftLabel:'Cancel', leftFunc:this.cancel, rightLabel:'Save', rightFunc:this.save,  };
    return (
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={navState.leftFunc.bind(this)} >
          <LabelText>{navState.leftLabel}</LabelText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={navState.rightFunc.bind(this)} >
          <LabelText>{navState.rightLabel}</LabelText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { renderModal,
      renderLoading,
      toolbar,
      previewImage
    } = this.state;
    const isCover = toolbar ==='cover';

    return (
      <View style={styles.container}>
        <View style={styles.videoContentReview}>
          <TouchableOpacity
            style={styles.videoContentReview}
            activeOpacity={isCover ? 1 : 0.8}
            onPress={isCover ? ()=>{} : () => this.setVideoPlay(!this.isPlaying)}
          >
            <VideoPlayer
              ref='videoplayer'
              maxtime={15}
              uri={this.video.uri}
              onBridgeMessage={this.onBridgeMessage.bind(this)}
            />
          </TouchableOpacity>

        </View>
        { this.renderToolbar() }
        { this.renderNavbar() }

        <PostDoneModal
          render={renderModal}
          numberOfImages={1}
          previewImage={previewImage}
          toggleVisible={this.toggleModalVisible}
          post={this.post}
        />
        {renderLoading && (
          <View style={styles.wrapLoading}>
            <Loading color={WHITE} />
            <TextBold style={styles.loadingText}>Posting...</TextBold>
          </View>
        )}
      </View>
    );
  }
}
