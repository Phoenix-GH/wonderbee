import React, { PropTypes } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import _ from 'lodash';
import { LabelText } from 'AppFonts';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
  },
  filter: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  }
});

const renderFilterComponents = (filterIcons, setFilter) => {
  return _.map(filterIcons, (item, index) => {
    const filter = `FILTER ${item}`;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setFilter(index)}
        style={styles.filter}
      >
        <Image source={{uri:item}} style={{width: 50,height: 50, resizeMode: 'cover'}} />
        <LabelText>{index === 0 ? 'No Filter' : `Filter ${index}`}</LabelText>
      </TouchableOpacity>
    );
  });
};

export const VideoFilterBar = ({ filterIcons, setFilter }) => (
  <ScrollView
    contentContainerStyle={styles.container}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    bounces={false}
  >
    {renderFilterComponents(filterIcons, setFilter)}
  </ScrollView>
);

VideoFilterBar.propTypes = {
  filterIcons: PropTypes.array,
  setFilter: PropTypes.func.isRequired,
};
