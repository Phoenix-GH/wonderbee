import React, { Component, PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ListView,
  StyleSheet,
  LayoutAnimation
} from 'react-native';
import Checkbox from 'react-native-checkbox';
import { UserAvatar } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { LabelText } from 'AppFonts';
import { AlertMessage, makeCancelable } from 'AppUtilities';
import { SEARCH_SERVICE } from 'AppServices';
import { BLUE, WHITE } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const backgroundColor = 'rgba(0, 0, 0, 0.9)';

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - 50,
    position: 'absolute',
    top: 50,
    left: 0,
    borderColor: BLUE,
    borderWidth: 2,
    backgroundColor,
  },
  listViewWrap: {
    flex: 1,
    overflow: 'hidden'
  },
  bottomBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: WHITE,
  },
  whiteText: {
    color: WHITE,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  searchRow: {
    height: 50,
  },
  username: {
    marginLeft: 10,
  },
  result: {
    margin: 10,
    justifyContent: 'space-between',
  },
  icon: {
    height: 40,
    width: 40,
    tintColor: WHITE,
  },
  input: {
    height: 35,
    width: WINDOW_WIDTH - 75,
    color: WHITE,
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
});

class SearchUserOverlay extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    selectUser: PropTypes.func.isRequired,
    cancelSearch: PropTypes.func.isRequired,
    doneSearch: PropTypes.func.isRequired,
    usersSelected: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: '',
      users: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.selected !== r2.selected
      }),
      loading: false,
      searchResultsExist: false,
    };
    this.users = [];
    this.onChangeText = ::this.onChangeText;
    this.renderUserRow = ::this.renderUserRow;
    this.selectUser = ::this.selectUser;
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    if (this.getSearch) {
      this.getSearch.cancel();
    }
  }

  onChangeText(search) {
    if (search.length > 0) {
      const { feathers } = this.props;
      this.setState({ search, loading: true });
      const exclude = [
        ...this.props.usersSelected,
        feathers.get('user').id,
      ];
      const lookInto = { users: { exclude } };
      this.getSearch = makeCancelable(
        feathers.service(SEARCH_SERVICE).create({ query: search, lookInto })
      );
      this.getSearch
      .promise
      .then(results => {
        this.users = results.users;
        this.setState({
          users: this.state.users.cloneWithRows(results.users),
          loading: false,
          searchResultsExist: results.users.length > 0,
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
    } else {
      this.setState({ search });
    }
  }

  selectUser(id, exists) {
    this.users = this.users.map(user => (user.id === id ? { ...user, selected: !exists } : user));
    this.setState({ users: this.state.users.cloneWithRows(this.users) });
    this.props.selectUser(id, exists);
  }

  renderUserRow(user) {
    const { usersSelected } = this.props;
    const exists = usersSelected.indexOf(user.id) > -1;
    return (
      <View style={[styles.row, styles.searchRow, styles.result]}>
        <View style={styles.row}>
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={50}
            iconStyle={{ width: 22, height: 25 }}
          />
          <LabelText style={[styles.whiteText, styles.username]}>
            {user.username}
          </LabelText>
        </View>
        <Checkbox
          label={null}
          checked={exists}
          onChange={() => this.selectUser(user.id, exists)}
          // TODO: Implement the styles specified in the PDF with the correct icons
          checkboxStyle={{ tintColor: WHITE }}
          underlayColor="transparent"
        />
      </View>
    );
  }

  render() {
    const { cancelSearch, doneSearch } = this.props;
    const { search, users } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.row, styles.searchRow]}>
          <Image source={require('img/icons/icon_search.png')} style={styles.icon} />
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={WHITE}
              onChangeText={this.onChangeText}
              underlineColorAndroid="transparent"
              value={search}
            />
          </View>
        </View>
        <View style={styles.listViewWrap}>
          <ListView
            dataSource={users}
            renderRow={this.renderUserRow}
            enableEmptySections={true}
          />
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={cancelSearch}>
            <LabelText>Cancel</LabelText>
          </TouchableOpacity>
          <TouchableOpacity onPress={doneSearch}>
            <LabelText style={styles.whiteText}>Done</LabelText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connectFeathers(SearchUserOverlay);
