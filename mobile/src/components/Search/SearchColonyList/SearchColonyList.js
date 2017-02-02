import React, { Component, PropTypes } from 'react';
import { View, ListView, Text, TouchableHighlight } from 'react-native';
import _ from 'lodash'
import { HexagonImage } from 'AppComponents';
import { styles } from './styles';

export class SearchColonyList extends Component {
  static propTypes = {
    colonies: PropTypes.arrayOf(PropTypes.shape({
      section: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    style: View.propTypes.style,
    onColonyPress: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    const categoryDataSource = new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const colonyDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      categoryDataSource: categoryDataSource.cloneWithRowsAndSections([]),
      colonyDataSource: colonyDataSource.cloneWithRows([]),
      activeCategory: null,
    };
    this.renderCategoryHeader = ::this.renderCategoryHeader;
    this.renderCategory = ::this.renderCategory;
    this.renderColony = ::this.renderColony;
  }

  componentWillMount() {
    this.updateDataSources(this.props.colonies);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDataSources(nextProps.colonies);
  }

  getActiveColonies(colonies) {
    return colonies.filter(({ isCategoryActive }) => isCategoryActive);
  }

  groupCategoriesBySection(colonies) {
    return _.chain(colonies)
      .groupBy('section')
      .values()
      .map(colonies => _.uniqBy(colonies, 'category'))
      .value();
  }

  updateDataSources(colonies) {
    const { categoryDataSource, colonyDataSource } = this.state;
    this.setState({
      categoryDataSource: categoryDataSource.cloneWithRowsAndSections(
        this.groupCategoriesBySection(colonies)
      ),
      colonyDataSource: colonyDataSource.cloneWithRows(
        this.getActiveColonies(colonies)
      ),
    });
  }

  handleCategoryPress(section, category) {
    const colonies = this.props.colonies.map(colony => ({
      ...colony,
      isCategoryActive: colony.section === section && colony.category === category,
    }));
    this.updateDataSources(colonies);
  }

  renderCategoryHeader(sectionData) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{sectionData[0].section.toUpperCase()}</Text>
      </View>
    )
  }

  renderCategory({ section, category, isCategoryActive }) {
    return (
      <TouchableHighlight
        activeOpacity={0.9}
        onPress={() => this.handleCategoryPress(section, category)}
      >
        <View>
          <View style={styles.category}>
            <Text style={isCategoryActive ? styles.activeCategoryText : styles.categoryText}>
              {category}
            </Text>
          </View>
          {isCategoryActive && (
            <ListView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              dataSource={this.state.colonyDataSource}
              renderRow={this.renderColony}
              style={styles.colonyList}
            />
          )}
        </View>
      </TouchableHighlight>
    )
  }

  renderColony(colony) {
    const { onColonyPress } = this.props;
    return (
      <HexagonImage
        imageSource={{ uri: colony.imageUrl }}
        text={colony.name.toUpperCase()}
        textWeight="bold"
        textSize={10}
        textColor="white"
        size={100}
        style={styles.colony}
        onPress={() => onColonyPress && onColonyPress(colony)}
      />
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.categoryDataSource}
        renderSectionHeader={this.renderCategoryHeader}
        renderRow={this.renderCategory}
        style={this.props.style}
      />
    );
  }
}
