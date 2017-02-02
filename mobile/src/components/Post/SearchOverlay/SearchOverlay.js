import React, { Component, PropTypes } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  LayoutAnimation,
  TextInput,
  ListView,
} from 'react-native';
import { ThreadUserRow, Loading } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { SEARCH_SERVICE } from 'AppServices';
import { WINDOW_WIDTH } from 'AppConstants';
import { PRIMARY_TEXT, WHITE } from 'AppColors';
import { makeCancelable } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 4 / 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  input: {
    width: WINDOW_WIDTH - 20,
    borderRadius: 6,
    backgroundColor: WHITE,
    color: PRIMARY_TEXT,
    fontSize: 15,
    fontFamily: 'Panton-Semibold',
    height: 35,
    paddingHorizontal: 15,
  },
  result: {
    borderColor: WHITE,
  },
  resultText: {
    color: WHITE,
  },
});

class SearchOverlay extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
      results: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loading: false,
    };
    this.handleChange = ::this.handleChange;
    this.search = ::this.search;
    this.renderRow = ::this.renderRow;
    this.getTextRef = ::this.getTextRef;
    this.panResponder = {};
    this.searchText = null;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => this.props.onPress(),
    });
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    if (this.searchText) {
      this.searchText.cancel();
    }
  }

  getTextRef() {
    this.setState({ results: this.state.results.cloneWithRows([]) });
    return this.textInput;
  }

  handleChange(text) {
    this.setState({ text, loading: text.length > 0 }, this.search);
  }

  search() {
    const { text } = this.state;
    const { feathers } = this.props;
    const lookInto = { users: true };
    if (text.length === 0) {
      return this.setState({
        results: this.state.results.cloneWithRows([]),
        loading: false
      });
    }
    this.searchText = makeCancelable(
      feathers.service(SEARCH_SERVICE).create({ query: text, lookInto })
    );
    return this.searchText.promise
    .then(results => {
      const customText = {
        id: 0,
        name: `Custom Text or Link: ${text}`,
        avatarUrl: require('img/icons/icon_text.png'),
        username: text,
      };
      this.setState({
        results: this.state.results.cloneWithRows([customText].concat(results.result)),
        loading: false
      });
    })
    .catch(error => console.log(error));
  }

  renderRow(result) {
    const { onPress } = this.props;
    return (
      <ThreadUserRow
        handlePress={() => onPress(result.id, result.username)}
        user={result}
        style={styles.result}
        textStyle={styles.resultText}
      />
    );
  }

  render() {
    const { loading, results } = this.state;
    const placeholder = 'Search for users';
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <TextInput
          ref={text => this.textInput = text}
          style={styles.input}
          placeholder={placeholder}
          autoFocus={true}
          onChangeText={this.handleChange}
          value={this.state.text}
        />
        {loading ? (
          <Loading />
        ) : (
          <ListView
            enableEmptySections={true}
            dataSource={results}
            renderRow={this.renderRow}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
}

export default connectFeathers(SearchOverlay, { withRef: true });
