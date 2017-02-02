import React, { Component, PropTypes } from 'react';
import { View, Image, ListView } from 'react-native';
import { ProfileTopNav, Group } from 'AppComponents';
import { GrayHeader } from 'AppFonts';
import { connectFeathers } from 'AppConnectors';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { GROUP_SERVICE } from 'AppServices';
import { styles } from './styles';

class GroupContainer extends Component {
  static propTypes = {
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      groups: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loading: true,
      hasGroups: false,
    };
    this._groups = [];
    this.renderRow = ::this.renderRow;
    this.renderListView = ::this.renderListView;
    this.joinGroup = :: this.joinGroup;
    this.onCreated = ::this.onCreated;
    this.getGroupsPromise = null;
  }

  componentWillMount() {
    this.getGroupsPromise = makeCancelable(this.props.feathers.service(GROUP_SERVICE).find());
    this.getGroupsPromise
      .promise
      .then(groups => {
        this._groups = groups.data;
        this.setState({
          groups: this.state.groups.cloneWithRows(groups.data),
          loading: false,
          hasGroups: groups.total > 0,
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  componentDidMount() {
    this.props.feathers.service(GROUP_SERVICE).on('created', this.onCreated);
  }

  componentWillUnmount() {
    this.props.feathers.service(GROUP_SERVICE).off('created', this.onCreated);
    if (this.getGroupsPromise) {
      this.getGroupsPromise.cancel();
    }
  }

  onCreated(group) {
    //  do something
    this._groups = this._groups.concat([group]);
    this.setState({
      groups: this.state.groups.cloneWithRows(this._groups)
    });
  }

  joinGroup(id) {
    this.props.feathers(GROUP_SERVICE).patch(id);
  }


  renderRow(group) {
    return (
      <Group
        group={group}
        joinGroup={this.joinGroup}
        routeEditScene={() => this.props.routeScene('GroupEditScene')}
      />
    );
  }

  renderListView() {
    if (this.state.hasGroups) {
      return (
        <ListView
          dataSource={this.state.groups}
          renderRow={this.renderRow}
        />
      );
    }
    return (
      <GrayHeader style={styles.center}>
        No Groups!
      </GrayHeader>
    );
  }

  render() {
    const { routeBack, routeScene } = this.props;
    return (
      <View style={styles.container}>
        <ProfileTopNav
          leftAction={routeBack}
          centerLabel="GROUPS"
          rightAction={() => routeScene('GroupCreateScene')}
          rightLabel={
            <Image
              source={require('img/icons/icon_profile_addGroup.png')}
              style={ styles.iconAddGroup }
            />
          }
        />
        {!this.state.loading && this.renderListView()}
      </View>
    );
  }
}

export default connectFeathers(GroupContainer);
