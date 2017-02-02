import React, { Component, PropTypes } from 'react';
import {
  View,
  ListView,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import _ from 'lodash';
import { styles } from './styles';
import {
  SimpleTopNav,
  UserAvatar,
  Loading,
  BackgroundAccounts
} from 'AppComponents';
import { ActionButton } from 'AppButtons';
import {
  WHITE,
  YELLOW,
  GREEN,
  SECONDARY_TEXT,
} from 'AppColors';
import { WINDOW_WIDTH, NAVBAR_HEIGHT } from 'AppConstants';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class SearchContacts extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    suggestions: PropTypes.array.isRequired,
    followings: PropTypes.array.isRequired,
    source: PropTypes.string.isRequired,
    signup: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: '',
      followings: [],
      suggestions: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => (
          (row1.isSelected !== row2.isSelected) || (row1.id !== row2.id)
        ),
      }).cloneWithRows([])
    };
    this.renderRow = ::this.renderRow;
    this.renderContent = ::this.renderContent;
    this.renderLoading = ::this.renderLoading;
    this.renderNotFound = ::this.renderNotFound;
    this.addToFollow = ::this.addToFollow;
    this.followAll = ::this.followAll;
    this.submit = ::this.submit;
    this.skip = ::this.skip;
    this.search = ::this.search;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.suggestions.length !== nextProps.suggestions.length) {
      this.setState({
        followings: nextProps.followings,
        suggestions: nextProps.suggestions,
        dataSource: this.state.dataSource.cloneWithRows(nextProps.suggestions)
      });
    }
  }

  addToFollow(user) {
    const { suggestions, dataSource } = this.state;
    const newState = suggestions.map((currentUser) => {
      if (currentUser.id === user.id) {
        return Object.assign({}, currentUser, {
          isSelected: !currentUser.isSelected
        });
      }
      return currentUser;
    });

    this.setState({
      suggestions: newState,
      dataSource: dataSource.cloneWithRows(newState),
    });
  }

  search(val) {
    const { suggestions, dataSource } = this.state;
    if (!val) {
      return this.setState({
        search: val,
        dataSource: dataSource.cloneWithRows(suggestions)
      });
    }
    const newSource = suggestions.filter((user) => {
      const username = user.username.toLowerCase();
      const name = user.name.toLowerCase();
      return username.includes(val.toLowerCase()) ||
          name.includes(val.toLowerCase());
    });

    return this.setState({
      search: val,
      dataSource: dataSource.cloneWithRows(newSource)
    });
  }

  skip() {
    this.props.onDone([], []);
  }

  submit() {
    const { followings, suggestions } = this.state;
    const wantToFollow = suggestions.reduce((prev, current) => {
      if (current.isSelected && followings.indexOf(current.id) === -1) {
        return prev.concat([current.id]);
      }
      return prev;
    }, []);
    const wantToRemove = suggestions.reduce((prev, current) => {
      if (!current.isSelected && followings.indexOf(current.id) >= 0) {
        return prev.concat([current.id]);
      }
      return prev;
    }, []);
    return this.props.onDone(wantToFollow, wantToRemove);
  }

  followAll() {
    const { suggestions, dataSource } = this.state;
    const newState = suggestions.map((user) => (
      Object.assign({}, user, {
        isSelected: true
      })
    ));
    this.setState({
      suggestions: newState,
      dataSource: dataSource.cloneWithRows(newState)
    });
  }

  renderRow(rowData) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <UserAvatar
            size={35}
            style={ styles.hexagonImageMarginRight }
            avatarUrl={rowData.avatarUrl ?
            { uri: rowData.avatarUrl } :
              require('img/icons/icon_fill_profile.png')}
          />
            <View style={styles.rowTextContent}>
              <Text style={styles.rowMainText}>
                {rowData.username}
              </Text>
              <Text style={styles.rowSecondaryText}>
                {rowData.name}
              </Text>
            </View>
        </View>
        <ActionButton
          onPress={() => this.addToFollow(rowData)}
          label={
            <View style={styles.rowAddButtonContainer}>
              { rowData.isSelected &&
              <Icon
                name={'check'}
                size={29}
                color={GREEN}
                style={styles.transparent}
              />
              }
            </View>
          }
          style={[
            styles.rowActionButton,
          ]}
        />
      </View>
    );
  }

  renderLoading() {
    return (
      <View style={styles.loader}>
        <Loading />
      </View>
    );
  }

  renderNotFound() {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>
          We can't find any users from your {this.props.source}, {'\n'}
          Seems like you're first from your friends ! {'\n'}
          Let's invite them to this cool App ! {'\n'}
          Welcome To JustHive !
        </Text>
      </View>
    );
  }

  renderContent() {
    const { dataSource, suggestions, search } = this.state;
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderLoading();
    }
    if (!isLoading && !suggestions.length) {
      return this.renderNotFound();
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
            marginBottom: 10,
            width: 0.9 * WINDOW_WIDTH
          }}
        >
          <Icon
            name="search"
            size={20}
            color={SECONDARY_TEXT}
            style={[
              styles.icon,
              { color: SECONDARY_TEXT },
              { marginRight: 5 },
              {
                transform: [{
                  scaleX: -1,
                }]
              }
            ]}
          />
          <View style={{ borderBottomWidth: 1, flex: 1 }}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Search..."
              clearButtonMode="while-editing"
              placeholderTextColor={SECONDARY_TEXT}
              onChangeText={this.search}
              value={search}
            />
          </View>
        </View>
        <View style={[styles.listViewContainer]}>
          <ListView
            renderRow={this.renderRow}
            enableEmptySections={true}
            dataSource={dataSource}
            style={[styles.listView]}
          />
        </View>
      </View>
    );
  }

  render() {
    const { onBack, source, signup } = this.props;

    if (signup) {
      return (
        <View style={styles.container}>
          <BackgroundAccounts
            style={styles.top}
            type={'green'}
            imageHeight={NAVBAR_HEIGHT}
            imageWidth={WINDOW_WIDTH}
          >
            <View>
              <Text style={styles.titleLabel} >
                Add and Invite Friends
              </Text>
            </View>
          </BackgroundAccounts>
          {this.renderContent()}
          <View style={styles.bottom}>
            <TouchableOpacity onPress={onBack} style={styles.left} >
              <Text style={[styles.grayText, styles.bold]}>back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.submit} style={styles.centerButton} >
              <Text style={[styles.whiteText, styles.bold, { textAlign: 'center' }]}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.skip} style={styles.right} >
              <Text style={[styles.grayText, styles.bold]}>skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <SimpleTopNav
          iconBack={true}
          leftAction={() => onBack()}
          rightLabel="DONE"
          rightAction={() => this.submit()}
          centerLabel={`FIND ${_.upperCase(source)}`}
          centerFontSize={17}
          sideFontSize={17}
          color={WHITE}
          backgroundColor={YELLOW}
        />
        {this.renderContent()}
      </View>
    );
  }
}
