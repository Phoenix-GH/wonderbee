import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { WHITE, GREEN, BLACK } from 'AppColors';
import { HexagonImage, TouchableOrNonTouchable } from 'AppComponents';
import { WINDOW_WIDTH } from 'AppConstants';
import { styles } from './styles';
import shallowCompare from 'react-addons-shallow-compare';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class HiveGrid extends Component {
  static propTypes = {
    colonies: PropTypes.array.isRequired,
    currentUser: PropTypes.number,
    onLayout: PropTypes.func,
    isSelectable: PropTypes.bool,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    colonies: [],
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRows: [],
    };
    this._dims = {
      hexagonSize: Math.sqrt(3) * WINDOW_WIDTH / 5 + 2.5,
    };
    this._rowMargin = {
      marginTop: - (this._dims.hexagonSize / 2) - 2.5,
    };
    this._emptyHexagons = 0;
    this._hexagonHeight = this._dims.hexagonSize;
    this._trendingsRows = 0;
    this.renderHexagonImages = ::this.renderHexagonImages;
    this.onHiveLayout = ::this.onHiveLayout;
    this.onHexagonSelect = ::this.onHexagonSelect;
    this.render1HexagonRow = ::this.render1HexagonRow;
    this.render2HexagonRow = ::this.render2HexagonRow;
    this.getColor = ::this.getColor;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onHiveLayout(event) {
    if (this.props.onLayout && !this._scrolled) {
      const { onLayout } = this.props;
      const h = this._hexagonHeight;
      const n = this._trendingsRows;
      const tHeight = n * h / 2;

      onLayout(tHeight, event);
      this._scrolled = true;
    }
  }

  onHexagonSelect(colony) {
    const { selectedRows } = this.state;
    const colonyIndex = selectedRows.indexOf(colony.id);
    if (colonyIndex === -1) {
      this.setState({
        selectedRows: [...selectedRows, colony.id]
      });
      return this.props.onSelect && this.props.onSelect(colony.id);
    }
    this.setState({
      selectedRows: selectedRows.filter(id => id !== colony.id)
    });
    return this.props.onSelect && this.props.onSelect(colony.id);
  }

  getColor(colony) {
    if (this.props.isSelectable || colony.empty) {
      return WHITE;
    }
    switch (colony.userId) {
      // case '1' : return YELLOW;
      // case this.props.currentUser.toString() : return BLUE;
      // default: return GREEN;
      // temporarily return all white just for testing
      case '1' : return WHITE;
      case this.props.currentUser.toString() : return WHITE;
      default: return WHITE;
    }
  }

  renderHexagonImages() {
    const { colonies } = this.props;
    const trendings = colonies.filter(col => col.userId === '1');
    const myColonies = this.props.currentUser ? colonies.filter(col =>
    col.userId === this.props.currentUser.toString()) : [];
    const staticColonies = colonies.filter(col =>
      !(['1', this.props.currentUser ? this.props.currentUser.toString() : '']
        .includes(col.userId)));

    this._trendingsRows = trendings.length % 3 === 1 ?
    Math.floor(trendings.length / 3) * 2 + 1 :
    Math.round(trendings.length / 3) * 2;
    const data = [
      ...trendings,
      ...myColonies,
      ...staticColonies,
    ];

    let rendered1 = true;
    let row = 1;
    const hive = [];
    if (data.length > 0) {
      hive.push(this.render1HexagonRow(data.splice(0, 1)[0], true, 'row-0'));
    }
    let i = 0;
    while (data.length) {
      hive.push(!rendered1 ?
        this.render1HexagonRow(data.splice(0, 1)[0], false, `row-${row++}`) :
        this.render2HexagonRow(
          data.splice(0, 2),
          false,
          `row-${row++}`,
        )
      );
      rendered1 = !rendered1;
      i++;
    }
    return (
      hive
    );
  }

  render1HexagonRow(colony, isFirst, key) {
    const { selectedRows } = this.state;
    const { isSelectable } = this.props;
    const isSelected = selectedRows.includes(colony.id);
    return (
      <View
        style={[styles.hexagons, styles.oneHexagonRow]}
        key={key}
      >
        <TouchableOrNonTouchable
          onPress={isSelectable ? () => this.onHexagonSelect(colony) : null}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <HexagonImage
            imageHeight={this._dims.hexagonSize * 1.5}
            imageWidth={this._dims.hexagonSize * 1.5}
            size={this._dims.hexagonSize}
            isHorizontal={true}
            imageSource={colony.avatarUrl ? { uri: colony.avatarUrl } :
                                           require('img/images/default_image.png')}
            backgroundColor={colony.empty ? WHITE : 'transparent'}
            text={colony.name}
            textColor={BLACK}
            textSize={15}
            textWeight={'bold'}
            borderColor={this.getColor(colony)}
            borderWidth={5}
            onPress={isSelectable || colony.empty ? null :
                                                    () => this.props.onSelect(colony)}
            isBottomText={true}
            style={!isFirst ? this._rowMargin : {}}
          />
        {isSelected && (
          <View style={{
            width: this._dims.hexagonSize / 2,
            height: this._dims.hexagonSize / 2,
            borderRadius: this._dims.hexagonSize / 4,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            top: this._dims.hexagonSize / 4,
            left: this._dims.hexagonSize / 3,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Icon
              name={'check'}
              size={this._dims.hexagonSize / 3}
              color={GREEN}
              style={styles.transparent}
            />
          </View>
          )
        }
        </TouchableOrNonTouchable>
      </View>
    );
  }

  render2HexagonRow(data, isFirst, key) {
    if (data.length < 2) {
      data.push({
        id: `empty-${this._emptyHexagons++}`,
        empty: true,
      });
    }
    const { selectedRows } = this.state;
    return (
      <View
        style={[styles.hexagons, styles.twoHexagonsRow]}
        key={key}
      >
        {data.map(col => (
        !col.empty ? <TouchableOrNonTouchable
          onPress={this.props.isSelectable ? () => this.onHexagonSelect(col) : null}
          style={{ alignItems: 'center', justifyContent: 'center' }}
          key={col.id}
        >
          <HexagonImage
            imageHeight={this._dims.hexagonSize * 1.5}
            imageWidth={this._dims.hexagonSize * 1.5}
            isHorizontal={true}
            size={this._dims.hexagonSize}
            imageSource={col.avatarUrl ? { uri: col.avatarUrl } :
                                           require('img/images/default_image.png')}
            backgroundColor={col.empty ? WHITE : 'transparent'}
            text={col.name}
            textColor={BLACK}
            textSize={15}
            textWeight={'bold'}
            borderColor={this.getColor(col)}
            borderWidth={5}
            onPress={this.props.isSelectable || col.empty ? null : () => this.props.onSelect(col)}
            isBottomText={true}
            style={!isFirst ? this._rowMargin : {}}
          />
          {selectedRows.includes(col.id) && (
            <View style={{
              width: this._dims.hexagonSize / 2,
              height: this._dims.hexagonSize / 2,
              borderRadius: this._dims.hexagonSize / 4,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              top: this._dims.hexagonSize / 4,
              left: this._dims.hexagonSize / 3,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Icon
                name={'check'}
                size={this._dims.hexagonSize / 3}
                color={GREEN}
                style={styles.transparent}
              />
            </View>
          )
          }
        </TouchableOrNonTouchable>
          :
          null
        ))
        }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onHiveLayout}>
        {this.renderHexagonImages()}
      </View>
    );
  }
}
