/* global navigator */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  ActivityIndicator,
  PanResponder,
  Platform,
} from 'react-native';
import GeolocationAPI from 'react-native/Libraries/Geolocation/Geolocation';
import { Separator } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { GEOLOCATION_SERVICE } from 'AppServices';
import { AlertMessage } from 'AppUtilities';
import { SECONDARY_TEXT, YELLOW } from 'AppColors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

const geolocationErrors = {
  1: ['Permission Denied', 'We haven\'t permission for this operation'],
  2: ['Position Unavailable', 'Please turn on your GPS'],
  3: ['Can\'t load location', 'We can\'t find you location'],
};

class Geolocation extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    searchType: PropTypes.oneOf([
      'address',
      'geocode',
      'establishment',
      '(regions)',
      '(cities)',
      'combination'
    ]),
    currentLocation: PropTypes.bool,
    currentLocationText: PropTypes.string,
    /* Common */
    inputWrapper: View.propTypes.style,
    containerStyle: View.propTypes.style,
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    allowsEmpty: PropTypes.bool,

    /* Input Props */
    inputStyle: TextInput.propTypes.style,
    inputOptions: PropTypes.object,

    /* ListView */
    listViewStyle: View.propTypes.style,
    rowStyle: View.propTypes.style,
    rowTextStyle: View.propTypes.style,
    listViewOptions: PropTypes.object,
  };
  static defaultProps = {
    inputOptions: {},
    listViewOptions: {},
    searchType: 'geocode',
    currentLocation: false,
    currentLocationText: 'Current Location',
    allowsEmpty: false,
  };

  constructor(...args) {
    super(...args);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (prevRow, nextRow) => (
        prevRow.isSelected !== nextRow.isSelected || prevRow !== nextRow
      ),
    });

    this.state = {
      places: [],
      dataSource,
      selectedCurrentPosition: false,
      hideCurrentLocation: false,
      coords: {},
      query: '',
      nearbyReady: false,
    };
    this._isMounted = false;
    this.onChange = ::this.onChange;
    this.search = ::this.search;
    this.updateListView = ::this.updateListView;
    this.renderRow = ::this.renderRow;
    this.selectPlace = ::this.selectPlace;
    this.getCurrentPosition = ::this.getCurrentPosition;
    this.renderHeader = ::this.renderHeader;
    this.panResponder = {};
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.allowsEmpty,
      onPanResponderGrant: () => this.props.onSelect(),
    });
    try {
      GeolocationAPI.getCurrentPosition(
        ({ coords }) => {
          if (!this._isMounted) {
            return;
          }
          this.setState({ coords, nearbyReady: true }, () => (
            this.state.query.length && this.onChange(this.state.query)
          ));
        },
        (err) => {
          const errorMessage = typeof err === 'string' ?
            [err, 'Please try again'] :
            geolocationErrors[err.code];
          AlertMessage.showMessage(...errorMessage);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } catch (e) {
      AlertMessage.fromRequest(e);
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChange(query) {
    this.setState({ query });
    if (!this.state.nearbyReady) {
      return null;
    }
    if (!query.length) {
      return this.updateListView();
    }
    const { onChange } = this.props;
    const { coords } = this.state;
    this.search(query, false, coords)
      .then(data => this.updateListView(data))
      .catch(err => AlertMessage.fromRequest(err));

    if (typeof onChange === 'function') {
      onChange(query);
    }
    return null;
  }

  getCurrentPosition() {
    if (this.state.selectedCurrentPosition) {
      return;
    }
    this.setState({
      selectedCurrentPosition: true
    });

    const { coords } = this.state;

    this.search(null, null, coords)
      .then((result) => {
        this.updateListView(result);
      })
      .then(() => this.setState({ hideCurrentLocation: true }))
      .catch(err => AlertMessage.fromRequest(err));
  }

  updateListView(places = []) {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.cloneWithRows(places),
      places,
    });
  }

  search(queryOrId, details, location = {}) {
    const { feathers, searchType } = this.props;
    const geolocationService = feathers.service(GEOLOCATION_SERVICE);

    const query = {
      name: queryOrId,
      types: searchType,
    };

    if (!details) {
      query.latitude = location.latitude;
      query.longitude = location.longitude;
      return geolocationService.find({ query });
    }

    return details ?
      geolocationService.get(queryOrId) :
      geolocationService.find({ query });
  }

  selectPlace(place = {}) {
    const { onSelect } = this.props;
    const { dataSource } = this.state;

    const places = this.state.places.map(placeData => {
      if (placeData.place_id !== place.place_id) {
        return placeData;
      }

      return Object.assign({}, placeData, {
        isSelected: true
      });
    });

    this.setState({
      places,
      dataSource: dataSource.cloneWithRows(places),
    });
    return this.search(place.place_id, true)
      .then(data => onSelect(data))
      .then(() => this._isMounted && this.setState({ query: place.description }))
      .then(() => this._isMounted && this.updateListView())
      .catch(err => AlertMessage.fromRequest(err));
  }

  renderHeader() {
    const {
      currentLocation,
      currentLocationText,
      rowStyle,
      rowTextStyle
    } = this.props;
    const {
      selectedCurrentPosition,
      hideCurrentLocation,
      nearbyReady
    } = this.state;
    if (!currentLocation ||
        hideCurrentLocation ||
        currentLocation) {
      return void(0);
    }

    if (!nearbyReady) {
      return (
        <TouchableOpacity onPress={this.getCurrentPosition}>
          <View style={[styles.row, rowStyle]}>
            <View style={[styles.row, rowStyle, styles.flexStart]}>
              <Icon name="location-on" style={styles.marginRight} color={YELLOW} size={25} />
              <Text style={[styles.rowText, rowTextStyle]}>Please wait...</Text>
            </View>
            <ActivityIndicator />
          </View>
          <Separator height={0.5} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.getCurrentPosition}>
        <View style={[styles.row, rowStyle]}>
          <View style={[styles.row, rowStyle, styles.flexStart]}>
            <Icon name="location-on" style={styles.marginRight} color={YELLOW} size={25} />
            <Text style={[styles.rowText, rowTextStyle]}>{currentLocationText}</Text>
          </View>
          { selectedCurrentPosition && <ActivityIndicator /> }
        </View>
        <Separator height={0.5} />
      </TouchableOpacity>
    );
  }

  renderRow(place) {
    const { rowStyle, rowTextStyle } = this.props;
    return (
      <TouchableOpacity key={place.place_id} onPress={() => this.selectPlace(place)}>
        <View style={[styles.row, rowStyle]}>
          <Text style={[styles.rowText, rowTextStyle]}>{place.description || place.name}</Text>
          { place.isSelected && <ActivityIndicator /> }
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { dataSource, query, nearbyReady } = this.state;
    const {
      containerStyle,
      inputOptions,
      inputStyle,
      listViewOptions,
      listViewStyle,
      inputWrapper,
    } = this.props;

    const defaultProps = {};
    if (!nearbyReady) {
      defaultProps.placeholder = 'Please wait...';
    }
    return (
      <View style={[styles.container, containerStyle]} {...this.panResponder.panHandlers}>
        <View style={[styles.inputWrapper, inputWrapper]}>
          <TextInput
            style={[styles.input, inputStyle]}
            clearButtonMode={'while-editing'}
            onChangeText={this.onChange}
            value={query}
            placeholderTextColor={SECONDARY_TEXT}
            {...inputOptions}
            {...defaultProps}
          />
        </View>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderHeader={this.renderHeader}
          renderRow={this.renderRow}
          renderSeparator={(sectionId, rowId) => (
            <Separator key={`sep:${sectionId}:${rowId}`} height={0.5} />
          )}
          style={[styles.listView, listViewStyle]}
          {...listViewOptions}
        />
      </View>
    );
  }
}

export default connectFeathers(Geolocation);
