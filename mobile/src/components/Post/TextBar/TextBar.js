import React, { PropTypes } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextSemiBold } from 'AppFonts';
import { GRAY, YELLOW, WHITE, BLACK } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - WINDOW_WIDTH * 4 / 3 - 50,
  },
  option: {
    marginBottom: 10,
    width: 70,
    height: 50,
    backgroundColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
  selectedFilter: {
    borderColor: YELLOW,
    borderWidth: 2,
  },
  textFilter1: {
    color: WHITE,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
    backgroundColor: 'transparent'
  },
  textFilter2: {
    color: WHITE,
    fontSize: 18,
    fontFamily: 'ProximaNova-Bold',
    backgroundColor: 'transparent'
  },
  textFilter3: {
    color: WHITE,
    fontSize: 18,
    fontFamily: 'ProximaNova-Black',
    backgroundColor: BLACK
  },
  textFilter4: {
    color: WHITE,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backgroundFilter1: {
    backgroundColor: 'rgb(0, 0, 0)'
  }
});


export function TextBar({ setTextFilter, textFilter }) {
  const arrayOfFilters = [
    { filter: 'normal', label: 'Normal',
      textStyle: styles.textFilter1, backStyle: styles.backgroundFilter1 },
    { filter: 'bold', label: 'Bold',
      textStyle: styles.textFilter2, backStyle: styles.backgroundFilter1 },
    { filter: 'meme', label: 'MEME',
      textStyle: styles.textFilter3, backStyle: styles.backgroundFilter1 },
    { filter: 'label', label: 'Label',
      textStyle: styles.textFilter4, backStyle: styles.backgroundFilter1 }
  ];
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal={true}
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
    {arrayOfFilters.map((filter, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => setTextFilter(filter.filter)}
        style={[styles.filter]}
      >
        <View
          style={[
            styles.option,
            filter.backStyle,
            textFilter === filter.filter && styles.selectedFilter
          ]}
        >
          <TextSemiBold style={[styles.text, filter.textStyle]} fontSize={35}>
            {filter.label}
          </TextSemiBold>
        </View>
      </TouchableOpacity>
    ))}
    </ScrollView>
  );
}

TextBar.propTypes = {
  setTextFilter: PropTypes.func.isRequired,
  textFilter: PropTypes.string.isRequired,
};
