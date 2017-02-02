import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { connectFeathers } from 'AppConnectors';
import { Topics, BackgroundAccounts } from 'AppComponents';
import { renderHexagonIcons, getHexagonLayout } from 'AppUtilities';
import { HEXAGON_IMAGE_SIZE, HEXAGON_SIZE, NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { YELLOW, BORDER_GRAY, SIGNUP_GRADIENT_START, SIGNUP_GRADIENT_END } from 'AppColors';
import { AlertMessage } from 'AppUtilities';
import { styles } from '../styles';
import { COLONY_SERVICE, USER_SERVICE } from 'AppServices';

class TopicsContainer extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    signup: PropTypes.bool.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      topics: [],
      isLoading: true,
    };
    this.hexagons = getHexagonLayout(3);
    this.handleSubmit = ::this.handleSubmit;
    this.renderHeader = ::this.renderHeader;
  }

  componentWillMount() {
    // const { feathers } = this.props;
    // return feathers.service(COLONY_SERVICE).find()
    //   .then(topics => console.log(topics) || this.setState({ topics: topics.data, isLoading: false }))
    //   .catch(err => AlertMessage.fromRequest(err));

    const topics = [];
    for (let i = 0; i < 20; i++) {
      topics.push({
        avatarUrl: "https://unsplash.it/200/200",
        createdAt: "2016-09-12T12:12:16.271Z",
        hashtags: null,
        id: i,
        locations: null,
        name: "name",
        updatedAt: "2016-09-12T12:12:17.940Z",
        userId: "1",
        users: null,
        visibility: "all",
      });
    }
    this.setState({ topics, isLoading: false });
  }

  handleSubmit(topics) {
    const { feathers, next } = this.props;
    const userId = feathers.get('user').id;

    if (_.isEmpty(topics)) {
      return next();
    }

    const userService = feathers.service(USER_SERVICE);
    return userService.patch(userId, { topics })
      .then(() => next())
      .catch((err) => AlertMessage.fromRequest(err));
  }

  renderHeader() {
    return renderHexagonIcons(
      _.flatten(
        this.hexagons.map((arr, i) =>
          arr.map((h, j) => {
            let icon = null;

            if (i === (this.hexagons.length - 1) && j === Math.floor(arr.length / 2)) {
              icon = 'person-outline';
            }
            return {
              key: `${i},${j}`,
              size: HEXAGON_SIZE,
              center: h.center,
              icon,
              borderWidth: 1,
              color: !!icon ? YELLOW : BORDER_GRAY,
            };
          })
        )
      )
    );
  }

  render() {
    const { topics, isLoading } = this.state;
    const { signup } = this.props;
    const yPosForLogoRow = this.hexagons[this.hexagons.length - 1][0].center.y;
    const heightStyle = { height: yPosForLogoRow + HEXAGON_IMAGE_SIZE / 2 };

    if (signup) {
      return (
        <View style={[styles.container, { paddingTop: 0 }]}>
          <BackgroundAccounts
            style={{
              flex: 0,
              height: NAVBAR_HEIGHT,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}
            imageHeight={NAVBAR_HEIGHT}
            imageWidth={WINDOW_WIDTH}
          >
            <View>
              <Text style={styles.titleLabel} >
                Personalize Your Content
              </Text>
            </View>
          </BackgroundAccounts>
          <View style={[styles.navigation, { top: undefined }]} >
            <Text style={styles.topicsTitleLabel} >
              Select Categories That Interest You
            </Text>
          </View>
          <Topics
            topics={topics}
            loading={isLoading}
            submitTopics={this.handleSubmit}
            signup={signup}
          />
        </View>
      );
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={[heightStyle, { top: -10 }]}>
            {this.renderHeader()}
          </View>
          <Topics
            topics={topics}
            loading={isLoading}
            submitTopics={this.handleSubmit}
            signup={signup}
          />
        </View>
      </View>
    );

  }
}

export default connectFeathers(TopicsContainer);
