/**
 * Created by simply on 7/28/16.
 */
import { Geolocation } from '../';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  geolocationListView: {
    flex: 1,
  },
  input: {
    color: 'yellow'
  },
  geolocationInputWrapper: {
    flex: 1
  },
});

export class GeolocationExample extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      location: {},
    };
    this.onSelect = ::this.onSelect;
  }
  onSelect(location) {
    this.setState({ location });
  }
  render() {
    return (
      <View>
        <Geolocation
          inputOptions={{
            placeholder: 'Where are you live now ?',
            autoFocus: false,
            autoCapitalize: 'none',
            autoCorrect: false,
            underlineColorAndroid: 'transparent',
          }}
          listViewStyle={styles.geolocationListView}
          inputStyle={styles.input}
          searchType={'address'}
          currentLocation={true}
          currentLocationText={'Get My Location !'}
          nearby={true}
          inputWrapper={styles.geolocationInputWrapper}
          onSelect={this.onSelect}
        />
      </View>
    );
  }

}
