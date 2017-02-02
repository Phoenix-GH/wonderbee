import React, { Component, PropTypes } from 'react';
import SwipeableListView from 'SwipeableListView';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  InteractionManager
} from 'react-native';
import { Colony, ProfileTopNav } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { GrayHeader, AuxText } from 'AppFonts';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { COLONY_SERVICE } from 'AppServices';
import { styles } from './styles';

class ColonyContainer extends Component {
  static propTypes = {
    routeBack: PropTypes.func.isRequired,
    routeScene: PropTypes.func.isRequired,
    user: PropTypes.object,
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      colonies: SwipeableListView.getNewDataSource(),
      loading: true,
      hasColonies: false,
      total: undefined,
    };
    this._colonies = [];
    this.renderRow = ::this.renderRow;
    this.renderListView = ::this.renderListView;
    this.getColonies = ::this.getColonies;
    this.onCreated = ::this.onCreated;
    this.renderColonyDelete = ::this.renderColonyDelete;
    this.removeColony = ::this.removeColony;
    this.alertRemove = ::this.alertRemove;
    this.getColonyPromise = null;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => this.getColonies());
  }

  componentDidMount() {
    this.props.feathers.service(COLONY_SERVICE).on('created', this.onCreated);
  }

  componentWillUnmount() {
    this.props.feathers.service(COLONY_SERVICE).off('created', this.onCreated);
  }

  onCreated(colony) {
    //  do something
    this._colonies = this._colonies.concat([colony]);
    this.setState({
      colonies: this.state.colonies.cloneWithRowsAndSections({ s1: this._colonies })
    });
  }

  getColonies() {
    if (this._colonies.length === this.state.total) return;
    const { feathers, user } = this.props;
    const query = {
      userId: user && user.id || feathers.get('user').id,
      fromProfile: true,
      $limit: 20,
      $skip: this._colonies.length,
    };
    this.getColonyPromise = makeCancelable(feathers.service(COLONY_SERVICE).find({ query }));
    this.getColonyPromise
    .promise
    .then(colonies => {
      this._colonies = this._colonies.concat(colonies.data);
      this.setState({
        colonies: this.state.colonies.cloneWithRowsAndSections({ s1: this._colonies }),
        loading: false,
        hasColonies: colonies.total > 0,
        total: colonies.total,
      });
    })
    .catch(error => AlertMessage.fromRequest(error));
  }

  alertRemove(colony) {
    Alert.alert(
      'Deleting colony',
      `Are you sure you want to delete the colony ${colony.name}?`,
      [
        { text: 'No', onPress: () => null },
        { text: 'Yes', style: 'destructive', onPress: () => this.removeColony(colony) }
      ],
    );
  }

  removeColony(colony) {
    this.props.feathers.service(COLONY_SERVICE).remove(colony.id)
      .then(() => {
        this._colonies = this._colonies.filter(col => col.id !== colony.id);
        this.setState({
          colonies: this.state.colonies.cloneWithRowsAndSections({ s1: this._colonies }),
        });
      })
      .catch(error => AlertMessage.fromRequest(error));
  }

  renderRow(colony) {
    return (<Colony
      colony={colony}
      style={styles.colony}
      routeCopy={() => this.props.routeScene('ColonyCreateScene', { copy: colony })}
      onPress={() => this.props.routeScene('FeedScene', {
        hasNavBar: true,
        navBarCenterLabel: colony.name,
        locations: colony.locations || [],
        hashtags: colony.hashtags || [],
        handles: colony.users || [],
      })}
    />);
  }

  renderColonyDelete(colony) {
    if (this.props.user && this.props.user.id !== this.props.feathers.get('user').id) return null;
    return (
      <TouchableOpacity
        onPress={() => this.alertRemove(colony)}
        style={styles.delete}
      >
        <AuxText style={styles.colonyDeleteText}>DELETE</AuxText>
      </TouchableOpacity>);
  }

  renderListView() {
    if (this.state.hasColonies) {
      return (
        <SwipeableListView
          enableEmptySections={true}
          dataSource={this.state.colonies}
          renderRow={this.renderRow}
          maxSwipeDistance={100}
          renderQuickActions={(colony) => this.renderColonyDelete(colony)}
          onEndReachedThreshold={100}
          onEndReached={this.getColonies}
        />
      );
    }
    return (
      <GrayHeader style={styles.center}>
        No Colonies!
      </GrayHeader>
    );
  }

  render() {
    const { routeBack, routeScene, user } = this.props;
    const rightAction = user ? () => null : () => routeScene('ColonyCreateScene');
    const rightLabel = !user && (
      <Image
        source={require('img/icons/icon_profile_colonyAdd.png')}
        style={ styles.iconColonyAdd }
      />
    );
    return (
      <View style={styles.container}>
        <ProfileTopNav
          leftAction={routeBack}
          centerLabel="COLONIES"
          rightAction={rightAction}
          rightLabel={rightLabel}
        />
        {!this.state.loading && this.renderListView()}
      </View>
    );
  }
}

export default connectFeathers(ColonyContainer);
