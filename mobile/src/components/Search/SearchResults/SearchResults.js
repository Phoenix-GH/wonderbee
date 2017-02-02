import React, { Component, PropTypes } from 'react';
import { View, ListView, Text, TouchableOpacity } from 'react-native';
import { UserAvatar, Follower, Loading } from 'AppComponents';
import { styles } from './styles';

export class SearchResults extends Component {
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      label: PropTypes.string.isRequired,
      smallText: PropTypes.string,
      id: PropTypes.number.isRequired,
      data: PropTypes.object,
    })).isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    style: View.propTypes.style,
    onErrorPress: PropTypes.func,
    routeScene: PropTypes.func,
    followUser: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(props.results),
    };

    this.handlePress = ::this.handlePress;
    this.renderRow = ::this.renderRow;
  }

  componentWillReceiveProps({ results }) {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.cloneWithRows(results),
    });
  }

  handlePress(type, id, data, label) {
    switch (type) {
      case 'User':
        return this.props.routeScene('ProfileScene', { userPass: { id } });
      case 'Hashtag':
        return this.props.routeScene('FeedScene', { hashtags: [id] });
      case 'Place':
        return this.props.routeScene('FeedScene', { locations: [id] });
      case 'Colony':
        return this.props.routeScene('Feed360Scene', {
          handles: data.users || [],
          hashtags: data.hashtags || [],
          locations: data.locations || [],
          colonyName: label,
        });
      default: return null;
    }
  }

  showAvatar(type) {
    return ['User'].includes(type);
  }

  renderMessage(message) {
    const { style } = this.props;
    return (
      <View style={style}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    );
  }

  renderError(error) {
    const { style, onErrorPress } = this.props;
    return (
      <View style={style}>
        <View style={styles.messageContainer}>
          <TouchableOpacity onPress={onErrorPress}>
            <Text style={[styles.message, styles.error]}>{error}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderRow(result) {
    const { type, imageUrl, label, smallText, id, data } = result;
    if (type === 'User') {
      return (
        <Follower
          user={data}
          followUser={this.props.followUser}
          currentlyFollowing={data.currentlyFollowing}
          notCurrentUser={true}
          routeScene={() => this.props.routeScene('ProfileScene', { userPass: data })}
        />
      );
    }
    return (
      <View key={`${type}${id}`} style={styles.listItem}>
       {this.showAvatar(type) && <View style={styles.imageContainer}>
           <UserAvatar
             avatarUrl={imageUrl}
             size={40}
             iconStyle={{ width: 18, height: 21 }}
             onPress={() => this.handlePress(type, id, data, label)}
           />
        </View>}
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => this.handlePress(type, id, data, label)}
        >
          <Text style={styles.text}>{label}</Text>
          {smallText && !!smallText.length && <Text
            style={styles.smallText}
          >
            {smallText}
          </Text>}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { results, isLoading, error, style } = this.props;
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return this.renderError(error);
    }
    if (!results.length) {
      return this.renderMessage('No results found');
    }
    return (
      <View style={style}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listView}
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    );
  }
}
