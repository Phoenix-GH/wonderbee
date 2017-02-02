import React, { PropTypes, Component } from 'react';
import { View, TextInput, StyleSheet, PanResponder } from 'react-native';
import { WHITE, BLACK } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 4 / 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
  },
  textFilter1: {
    color: WHITE,
    fontSize: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Regular',
    backgroundColor: 'transparent',
  },
  textFilter2: {
    color: WHITE,
    fontSize: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Bold',
    backgroundColor: 'transparent'
  },
  textFilter3: {
    color: WHITE,
    fontSize: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Black',
    backgroundColor: BLACK
  },
  textFilter4: {
    color: WHITE,
    fontSize: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
});

const getStyle = (textFilter) => {
  switch (textFilter) {
    case 'bold':
      return styles.textFilter2;
    case 'label':
      return styles.textFilter4;
    case 'meme':
      return styles.textFilter3;
    case 'normal':
    default:
      return styles.textFilter1;
  }
};

export class TextInputOverlay extends Component {
  static propTypes = {
    textFilter: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      height: 40,
    };
    this.onContentSizeChange = ::this.onContentSizeChange;
    this.textInput = null;
    this.panResponder = {};
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.textInput.blur();
      }
    });
  }

  onContentSizeChange(event) {
    const { height } = event.nativeEvent.contentSize;
    this.setState({ height });
  }

  render() {
    const { onChange, onBlur, textFilter } = this.props;
    const { height } = this.state;
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <TextInput
          ref={text => this.textInput = text}
          onContentSizeChange={this.onContentSizeChange}
          multiline={true}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={true}
          style={[styles.input, getStyle(textFilter), { height }]}
        />
      </View>
    );
  }
}
