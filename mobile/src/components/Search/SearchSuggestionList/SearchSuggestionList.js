import React, { Component, PropTypes } from 'react';
import { View, ListView, Text } from 'react-native';
import { HexagonImage } from 'AppComponents';
import { styles } from './styles';

export class SearchSuggestionList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })).isRequired,
    style: View.propTypes.style,
  }

  constructor(props, context) {
    super(props, context);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(props.suggestions),
    };
  }

  componentWillReceiveProps({ suggestions }) {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.cloneWithRows(suggestions)
    });
  }

  render() {
    const { title, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          <Text style={styles.instructions}>SCROLL RIGHT FOR MORE</Text>
        </View>
        <ListView
          enableEmptySections={true}
          horizontal={true}
          pageSize={2}
          dataSource={this.state.dataSource}
          renderRow={({ type, imageUrl, label, id }) => (
            <View key={`${type}${id}`} style={styles.listItem}>
              <View style={styles.imageContainer}>
                <HexagonImage imageSource={{ uri: imageUrl }} size={40} />
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
              </View>
            </View>
          )}
          style={styles.listView}
        />
      </View>
    );
  }
}
