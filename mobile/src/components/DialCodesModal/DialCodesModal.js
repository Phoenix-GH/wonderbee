import React, { Component, PropTypes } from 'react';
import {
  View,
  Modal,
  ListView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { Loading, Separator } from 'AppComponents';
import { AuxText } from 'AppFonts';
import { emptyFunction, AlertMessage } from 'AppUtilities';
import { VERIFICATION_SERVICE } from 'AppServices';
import { connectFeathers } from 'AppConnectors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import shallowCompare from 'react-addons-shallow-compare';
import {
  WHITE,
  BLACK,
  LIGHT_GRAY,
  GRAY,
  HUE_GRAY
} from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  title: {
    padding: 5,
    color: BLACK
  },
  dialog: {
    backgroundColor: WHITE,
    width: 0.7 * WINDOW_WIDTH,
    height: 0.7 * WINDOW_HEIGHT,
    borderRadius: 10,
  },
  inputContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: HUE_GRAY,
    alignItems: 'center',
    marginBottom: 5
  },
  icon: {
    marginRight: 5
  },
  rowText: {
    color: BLACK
  },
  input: {
    flex: 1,
    height: 40
  },
  row: {
    paddingHorizontal: 10,
  },
  listView: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    backgroundColor: LIGHT_GRAY,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomWidth: 1,
    borderColor: LIGHT_GRAY,
  }
});

class DialCodesModal extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    isVisible: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onClickOutside: PropTypes.func.isRequired
  };
  static defaultProps = {
    isVisible: false,
    onChange: emptyFunction,
  };

  constructor(props, context) {
    super(props, context);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.name !== row2.name
    });
    this.state = {
      codes: [],
      isLoading: true,
      dataSource: dataSource.cloneWithRows([])
    };
    this.onChange = ::this.onChange;
    this.renderRow = ::this.renderRow;
  }

  componentWillMount() {
    const { feathers } = this.props;
    const verificationService = feathers.service(VERIFICATION_SERVICE);
    const query = {
      dialCodes: true
    };
    verificationService.find({ query })
      .then((codes) => {
        this.setState({
          codes,
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(codes)
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        AlertMessage.fromRequest(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    const { codes, dataSource } = this.state;
    if (nextProps.isVisible === this.props.isVisible) {
      return;
    }
    if (!nextProps.isVisible && codes.length) {
      this.setState({
        dataSource: dataSource.cloneWithRows(codes)
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onChange(query) {
    const { codes, dataSource } = this.state;
    const filteredSource = codes.filter(code => (
      !!~code.dial_code.replace(/\s/g, '').indexOf(query) ||
      !!~code.name
        .toLowerCase()
        .indexOf(query.toLowerCase())
    ));
    this.setState({
      dataSource: dataSource.cloneWithRows(filteredSource)
    });
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(rowData)}
      >
        <View style={styles.row}>
          <AuxText
            upperCase={false}
            style={[styles.transparent, styles.rowText]}
          >
            {rowData.name} ({rowData.dial_code})
          </AuxText>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { isVisible, onClickOutside } = this.props;
    const { dataSource, isLoading } = this.state;
    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType={'fade'}
      >
        <TouchableWithoutFeedback onPress={onClickOutside}>
          <View style={styles.container}>
            <View style={styles.dialog}>
              <View style={styles.headerContainer}>
                <AuxText
                  style={[
                    styles.transparent,
                    styles.title
                  ]}
                >
                  Select Your Country
                </AuxText>
              </View>
              <View style={styles.inputContainer}>
                <Icon
                  name={'search'}
                  size={25}
                  color={LIGHT_GRAY}
                  style={styles.icon}
                />
                <TextInput
                  autoCapitalize={'words'}
                  autoCorrect={true}
                  style={styles.input}
                  clearButtonMode={'while-editing'}
                  onChangeText={this.onChange}
                  placeholder={'Country name or code'}
                />
              </View>
              {isLoading ? (
                <View style={styles.loader}>
                  <Loading />
                </View>
              ) : (
                <ListView
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  contentContainerStyle={styles.listView}
                  renderSeparator={(sectionId, rowId) => (
                    <Separator height={0.5} key={`${sectionId}:${rowId}`} />
                  )}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connectFeathers(DialCodesModal);
