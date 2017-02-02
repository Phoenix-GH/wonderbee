import React, { PropTypes } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Surface, resolveAssetSource } from 'gl-react-native';
import _ from 'lodash';
import { Filter } from 'AppComponents';
import { TextSemiBold } from 'AppFonts';
import { styles } from './styles';

const filters = [
  'Normal',
  'Retro',
  'Amaro',
  'Brannan',
  'Earlybird',
  'Hefe',
  'Hudson',
  'Inkwell',
  'Lokofi',
  'LordKelvin',
  'Nashville',
  'Rise',
  'Sierra',
  'Sutro',
  'Toaster',
  'Valencia',
  'Walden',
  'XproII',
];

const renderFilterComponents = (setImageFilter, filterImage) => {
  return filters.map((filter, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setImageFilter(index === 0 ? '' : filter)}
        style={styles.filter}
      >
        <Surface
          style={styles.surface}
          width={50}
          height={50}
        >
          <Filter filter={filter}>
            {filterImage.uri || resolveAssetSource(require('img/images/default_image.png')).uri}
          </Filter>
        </Surface>
        <TextSemiBold>{index === 0 ? 'No Filter' : filter}</TextSemiBold>
      </TouchableOpacity>
    );
  });
};

export const FilterBar = ({ setImageFilter, filterImage }) => (
  <ScrollView
    contentContainerStyle={styles.container}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    bounces={false}
  >
    {renderFilterComponents(setImageFilter, filterImage)}
  </ScrollView>
);

FilterBar.propTypes = {
  filterImage: PropTypes.any,
  setImageFilter: PropTypes.func.isRequired,
};
