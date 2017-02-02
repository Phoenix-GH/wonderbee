import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SEARCH_FILTERS } from 'AppConstants';
import { styles } from './styles';

export class SearchFilterBar extends Component {
  static propTypes = {
    style: View.propTypes.style,
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    scrollValue: PropTypes.any,
  };

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  }

  getFilters() {
    return [
      SEARCH_FILTERS.PEOPLE,
      SEARCH_FILTERS.HASHTAGS,
      SEARCH_FILTERS.PLACES,
      SEARCH_FILTERS.COLONIES,
    ];
  }

  setAnimationValue() {
    return true;
  }

  getFilterContainerStyle(filter) {
    // Filter "Colonies" needs more space
    if (filter === SEARCH_FILTERS.COLONIES) {
      return [styles.filterContainer, { flex: 1.2 }];
    }
    // The last filter shouldn't have a right border
    const filters = this.getFilters();
    if (filter === filters[filters.length - 1]) {
      return [styles.filterContainer, { borderRightWidth: 0 }];
    }
    return styles.filterContainer;
  }

  getFilterStyle(active) {
    return active ? [styles.filter, styles.activeFilter] : styles.filter;
  }

  render() {
    const { style, tabs, goToPage, activeTab } = this.props;
    return (
      <View style={style}>
        <View style={styles.container}>
          {tabs.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={this.getFilterContainerStyle(tab)}
              onPress={() => goToPage(i)}
            >
              <Text style={this.getFilterStyle(i === activeTab)}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}
