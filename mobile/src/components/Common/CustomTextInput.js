import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  ListView,
} from 'react-native';
import {
  SelectedUser,
  Close,
} from 'AppComponents';
import { makeCancelable, AlertMessage } from 'AppUtilities';
import { customTextInputStyles as styles } from './styles';
import { WHITE } from 'AppColors';
import { isEqual } from 'lodash';

export class CustomTextInput extends Component {
  static defaultProps = {
    entries: [],
    value: '',
    preExclude: [],
    maxSelect: 10,
    selectNameKey: 'name',
    isSearchShowAvatar: false,
  };
  static propTypes = {
    containerStyles: View.propTypes.style,
    style: TextInput.propTypes.style,
    onChangeText: PropTypes.func,
    invalidChars: PropTypes.object,
    isMultiSelect: PropTypes.bool,
    selectNameKey: PropTypes.string,
    isSearchShowAvatar: PropTypes.bool,
    searchService: PropTypes.object,
    lookInto: PropTypes.string,
    preExclude: PropTypes.array,
    addEntry: PropTypes.func,
    removeEntry: PropTypes.func,
    entries: PropTypes.array,
    value: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onLayout: PropTypes.func,
    maxSelect: PropTypes.number,
    icon: PropTypes.any,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    onMeasure: PropTypes.func,
  };
  constructor(props, context) {
    super(props, context);

    this._oldWidth = 0;
    this._entryCounter = 0;
    this._searchResults = [];

    this.state = {
      isLoading: false,
      searchResultsExist: false,
      searchResults: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      value: this.props.value,
      entries: this.normalizeEntries(),
    };

    this.onChangeText = ::this.onChangeText;
    this.addEntry = ::this.addEntry;
    this.removeEntry = ::this.removeEntry;
    this.scrollToEnd = ::this.scrollToEnd;
    this.clearText = ::this.clearText;
    this.onFocus = ::this.onFocus;
    this.measure = :: this.measure;
    this.onLayout = ::this.onLayout;
  }

  componentDidMount() {
    this.measure();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && !isEqual(nextProps.value, this.state.value)) {
      this.setState({
        value: nextProps.value,
      });
    }

    if (nextProps.entries && !isEqual(nextProps.entries, this.state.entries)) {
      this.setState({
        entries: nextProps.entries,
      });
    }
  }

  componentWillUnmount() {
    if (this._searchPromise) {
      this._searchPromise.cancel();
    }
    if (this._measureTimeout) {
      clearTimeout(this._measureTimeout);
      this._measureTimeout = null;
    }
  }

  onChangeText(inputText) {
    let text;
    if (this.props.invalidChars) {
      text = inputText.replace(this.props.invalidChars, '');
    } else {
      text = inputText;
    }
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }

    if (this.props.searchService && this.props.lookInto && text.trim().length) {
      this.props.onSearch({
        isLoading: true,
        lookInto: this.props.lookInto,
      });
      if (this._searchPromise) {
        this._searchPromise.cancel();
      }
      this._searchPromise = makeCancelable(this.props.searchService.create({
        query: text.trim(),
        onlyBegins: true,
        lookInto: {
          [this.props.lookInto]: {
            exclude: this.props.preExclude.concat(this.state.entries.map(entry => entry.id))
          }
        }
      }));

      this._searchPromise.promise
        .then(results => {
          this._searchResults = results[this.props.lookInto];
          this.setState({
            searchResultsExist: results[this.props.lookInto].length > 0,
            searchResults: this.state.searchResults.cloneWithRows(results[this.props.lookInto])
          });
          this.props.onSearch({
            isLoading: false,
            searchResultsExist: results[this.props.lookInto].length > 0,
            searchResults: this.state.searchResults.cloneWithRows(results[this.props.lookInto])
          });
        }
       )
        .catch(error => {
          this.setState({
            isLoading: false,
            searchResultsExist: false,
          });
          if (this.props.onSearch) {
            this.props.onSearch({ value: '' });
          }
          AlertMessage.fromRequest(error);
        });
    }
    this.setState({
      value: text,
    }, this.props.onSearch && this.props.onSearch({ value: text }));
  }

  onFocus(...args) {
    const { onFocus, onSearch } = this.props;
    if (onFocus) {
      onFocus(...args);
    }
    if (onSearch) {
      onSearch({
        value: this.state.value,
        isLoading: false,
        searchResultsExist: this._searchResults.length > 0,
        searchResults: this.state.searchResults.cloneWithRows(this._searchResults),
        lookInto: this.props.lookInto,
      });
    }
  }

  onLayout(...args) {
    if (this.props.onLayout) {
      this.props.onLayout(...args);
    }
  }

  measure() {
    if (this.props.onMeasure) {
      this._measureTimeout = setTimeout(() =>
        this._container.measure((...positions) =>
          this.props.onMeasure(positions)));
    }
  }

  clearText() {
    if (this.state.value.length) {
      this.setState({
        value: '',
      });
      if (this.props.onSearch) {
        this.props.onSearch({ value: '' });
      }
    }
  }

  normalizeEntries() {
    if (!this.props.isMultiSelect || this.props.searchService) {
      return this.props.entries;
    }
    return this.props.entries.map(entry => ({ ...entry, id: this._entryCounter++ }));
  }

  addEntry(entry) {
    if (!this.state.value.trim().length) return;
    if (this.state.entries.length === this.props.maxSelect) return;

    const entryToAdd = entry || { name: this.state.value.trim(), id: this._entryCounter++ };
    if (this.props.addEntry) {
      this.props.addEntry(entryToAdd);
    }
    if (this.props.searchService && entry) {
      this._searchResults = this._searchResults.filter(sResult => sResult.id !== entryToAdd.id);
    }
    this.setState({
      entries: [...this.state.entries, entryToAdd],
      value: entry ? this.state.value : '',
    });
    this.props.onSearch({
      searchResults: this.props.searchService && entry ?
        this.state.searchResults.cloneWithRows(this._searchResults) :
        this.state.searchResults,
      value: '',
    });
  }

  removeEntry(removedEntry) {
    if (this.props.removeEntry) {
      this.props.removeEntry(removedEntry);
    }
    this.setState({
      entries: this.state.entries.filter(entry => entry !== removedEntry),
    });
  }

  scrollToEnd(width) {
    if (width > this._scrollViewWidth && width > this._oldWidth) {
      this._selectList.scrollTo({ x: width - this._scrollViewWidth });
    }
    this._oldWidth = width;
  }

  render() {
    const {
      containerStyles,
      style,
      isMultiSelect,
      onBlur,
      selectNameKey,
      icon,
      placeholder,
    } = this.props;
    const { value, entries } = this.state;
    const inputStyle = value.length ? { textAlign: 'left' } : { textAlign: 'center' };

    return (
      <View
        style={[styles.container, containerStyles]}
        ref={ref => this._container = ref}
        onLayout={this.onLayout}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, icon ? styles.textInputPadding : {}, inputStyle, style]}
            placeholder={placeholder}
            placeholderTextColor={WHITE}
            onChangeText={this.onChangeText}
            value={value}
            onFocus={this.onFocus}
            onBlur={onBlur}
            underlineColorAndroid="transparent"
          />
        </View>
        {icon && <View style={styles.image}>
          <Image source={icon} style={styles.iconAdd} />
        </View>}
        {value.length > 0 &&
          <Close
            close={this.clearText}
            style={styles.iconClear}
            containerStyle={styles.clear}
          />
        }
        {isMultiSelect && entries.length > 0 && <ScrollView
          ref={(ref) => this._selectList = ref}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.multiScroll}
          onContentSizeChange={this.scrollToEnd}
          onLayout={ev => this._scrollViewWidth = ev.nativeEvent.layout.width}
        >
          {entries.map(entry => <SelectedUser
            key={entry.id}
            removeSelected={this.removeEntry}
            user={entry}
            nameKey={selectNameKey}
            style={styles.selected}
            textStyle={styles.selectedText}
            removeWithClick={true}
          />)}
        </ScrollView>}
      </View>
    );
  }
}
