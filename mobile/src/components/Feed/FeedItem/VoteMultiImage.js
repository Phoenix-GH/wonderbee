import React, { Component, PropTypes } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { WHITE, LIGHT_GRAY, BLUE, BLACK } from 'AppColors';
import { range } from 'lodash';

const styles = StyleSheet.create({
  progressWrap: {
    position: 'absolute'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    color: LIGHT_GRAY,
  },
  highestback: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  highestText: {
    color: WHITE,
    fontSize: 40,
  },
  votedback: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  votedText: {
    color: BLACK
  },
});

export class VoteMultiImage extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    imageLength: PropTypes.number.isRequired,
    layout: PropTypes.string.isRequired,
    left: PropTypes.object.isRequired,
    imageVoteDetails: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      voted: false,
      progress: [],
    };
    this.getDimensions = ::this.getDimensions;
    this.setVoteValue = ::this.setVoteValue;
    this.resetVoteDetails = ::this.resetVoteDetails;
  }

  setVoteValue() {
    const { imageVoteDetails } = this.props;
    this.setState({ progress: imageVoteDetails });
  }

  getDimensions() {
    const { layout, width, height, imageLength } = this.props;
    switch (layout) {
      case 'quad':
        return {
          left: width / 4 - 40,
          top: height / 4 - 40,
        };
      case 'horizontal':
        return {
          left: width / 2 - 40,
          top: height / imageLength / 2 - 40,
        };
      case 'vertical':
      default:
        return {
          left: width / imageLength / 2 - 40,
          top: height / 2 - 40,
        };
    }
  }

  resetVoteDetails() {
    this.setState({ progress: [] });
  }

  render() {
    const { imageLength, width, height, layout, imageVoteDetails, left: leftOverlay } = this.props;
    const { progress: progressLevel } = this.state;
    const { top: tempTop, left: tempLeft } = this.getDimensions();
    return (
      <Animated.View
        style={[styles.container, { height, width, left: leftOverlay }]}
      >
        {range(imageLength).map(i => {
          let left = layout === 'vertical' ?
            tempLeft + width / imageLength * i :
            tempLeft;
          let top = layout === 'horizontal' ?
            tempTop + height / imageLength * i :
            tempTop;
          if (layout === 'quad') {
            left = tempLeft * (i % 2 + 1) + (width / 2 - width / 4 + 40) * (i % 2);
            top = tempTop * (i < 2 ? 1 : 2) + (height / 2 - height / 4 + 40) * (i < 2 ? 0 : 1);
          }
          const imageVote = imageVoteDetails.filter(img => img.order === (i + 1))[0];
          const progress = progressLevel.filter(img => img.order === (i + 1))[0];
          if (imageVote && imageVote.highest) {
            left -= 20;
            top -= 20;
          }
          return (
            <View
              key={i}
              style={[styles.progressWrap, { left, top }]}
            >
              <View
                style={[
                  styles.backgroundColor,
                  imageVote && imageVote.highest && styles.highestback,
                  imageVote && imageVote.voted && styles.votedback,
                ]}
              />
              <Progress.Circle
                size={imageVote && imageVote.highest ? 120 : 80}
                color={BLUE}
                progress={progress && progress.percentage || 0}
                showsText={true}
                borderWidth={0}
                textStyle={[
                  styles.text,
                  imageVote && imageVote.highest && styles.highestText,
                  imageVote && imageVote.voted && styles.votedText
                ]}
              />
            </View>
          );
        })}
      </Animated.View>
    );
  }
}
