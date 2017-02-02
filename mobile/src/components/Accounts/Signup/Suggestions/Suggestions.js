import React, { Component, PropTypes } from 'react';
import {
  ListView,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { LabelText } from 'AppFonts';
import { Separator, UserAvatar } from 'AppComponents';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { GREEN } from 'AppColors';
import { ActionButton } from 'AppButtons';

export class Suggestions extends Component {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    people: PropTypes.array.isRequired,
    scrollViewStyle: ScrollView.propTypes.style,
  };

  constructor(props, context) {
    super(props, context);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.isSelected !== row2.isSelected
    });

    this.state = {
      groupsDataSource: dataSource.cloneWithRows(props.groups),
      peopleDataSource: dataSource.cloneWithRows(props.people)
    };
    this.data = {
      groups: props.groups,
      people: props.people
    };
    this.selectGroup = ::this.selectGroup;
    this.selectPeople = ::this.selectPeople;
    this.getResult = ::this.getResult;
    this.renderGroupsRow = ::this.renderGroupsRow;
    this.renderPeopleRow = ::this.renderPeopleRow;
    this.renderGroupsFooter = ::this.renderGroupsFooter;
    this.renderPeopleFooter = ::this.renderPeopleFooter;
    this.renderSeparator = ::this.renderSeparator;
  }

  getResult() {
    const groups = _.reduce(this.data.groups, (prev, curr) => {
      if (curr.isSelected) {
        return prev.concat([curr.id]);
      }
      return prev;
    }, []);

    const people = _.reduce(this.data.people, (prev, curr) => {
      if (curr.isSelected) {
        return prev.concat([curr.id]);
      }
      return prev;
    }, []);

    return { groups, people };
  }

  selectGroup(id) {
    const { groupsDataSource } = this.state;
    this.data.groups = this.data.groups.map((group) => {
      if (group.id === id) {
        return Object.assign({}, group, { isSelected: !group.isSelected });
      }
      return group;
    });
    return this.setState({
      groupsDataSource: groupsDataSource.cloneWithRows(this.data.groups)
    });
  }

  selectPeople(id) {
    const { peopleDataSource } = this.state;
    this.data.people = this.data.people.map(user => {
      if (user.id === id) {
        return Object.assign({}, user, { isSelected: !user.isSelected });
      }
      return user;
    });
    this.setState({
      peopleDataSource: peopleDataSource.cloneWithRows(this.data.people)
    });
  }

  renderGroupsRow(rowData) {
    return (
      <View style={styles.row}>
        <UserAvatar
          size={40}
          avatarUrl={rowData.img}
          style={styles.rowImage}
        />
        <View style={styles.rowContent}>
          <View>
            <Text style={styles.rowMainText}>{rowData.name}</Text>
            <Text style={styles.rowSecondaryText}>{rowData.members} MEMBERS</Text>
          </View>
          <ActionButton
            onPress={() => this.selectGroup(rowData.id)}
            label={
              <View style={styles.rowAddButtonContainer}>
                { rowData.isSelected &&
                <Icon
                  name={'check'}
                  size={29}
                  color={GREEN}
                  style={styles.transparent}
                />
                }
              </View>
            }
            style={[
              styles.rowActionButton,
            ]}
          />
        </View>
      </View>
    );
  }

  renderSeparator(sectionId, rowId) {
    return (
      <Separator
        key={`sep_${sectionId}:${rowId}`}
        height={0.5}
        style={{ marginTop: 5, marginBottom: 5 }}
      />
    );
  }

  renderGroupsFooter() {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>view more</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderPeopleRow(rowData) {
    return (
      <View style={styles.row}>
        <UserAvatar
          size={40}
          avatarUrl={rowData.avatarUrl}
          style={styles.rowImage}
        />
        <View style={styles.rowContent}>
          <View>
            <Text style={styles.rowMainText}>{rowData.username}</Text>
            <Text style={styles.rowSecondaryText}>{rowData.name} MEMBERS</Text>
          </View>
          <ActionButton
            onPress={() => this.selectPeople(rowData.id)}
            label={
              <View style={styles.rowAddButtonContainer}>
                { rowData.isSelected &&
                <Icon
                  name={'check'}
                  size={29}
                  color={GREEN}
                  style={styles.transparent}
                />
                }
              </View>
            }
            style={[
              styles.rowActionButton,
            ]}
          />
        </View>
      </View>
    );
  }

  renderPeopleFooter() {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>view more</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { peopleDataSource } = this.state;
    return (
      <ScrollView style={this.props.scrollViewStyle}>
        <View style={styles.container}>
          <View style={styles.groupsContainer}>
            <LabelText
              numberOfLines={1}
              upperCase={true}
              fontWeight="bold"
              style={styles.labelText}
            >
              People to follow
            </LabelText>
            <Separator height={0.5} />
            <ListView
              enableEmptySections={true}
              dataSource={peopleDataSource}
              renderRow={this.renderPeopleRow}
              renderFooter={this.renderPeopleFooter}
              renderSeparator={this.renderSeparator}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
