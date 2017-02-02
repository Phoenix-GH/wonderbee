import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import { UserAvatar } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { styles } from './styles';

export class SearchResult extends Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    addToState: PropTypes.func.isRequired,
    inState: PropTypes.bool.isRequired,
    sceneToRoute: PropTypes.string.isRequired,
    propsToPass: PropTypes.object.isRequired,
    resultType: PropTypes.string.isRequired,
    routeScene: PropTypes.func.isRequired,
    addedStateIcon: PropTypes.any.isRequired,
    notAddedStateIcon: PropTypes.any.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      inState: props.inState,
    };
    this.addToState = ::this.addToState;
    this.renderImage = ::this.renderImage;
  }

  componentWillReceiveProps({ inState }) {
    this.setState({ inState });
  }

  addToState(resultId, type) {
    this.setState({ inState: !this.state.inState });
    this.props.addToState(resultId, type);
  }

  renderImage(inState) {
    const { addedStateIcon, notAddedStateIcon } = this.props;
    const source = inState ? addedStateIcon : notAddedStateIcon;
    return (
      <Image
        source={source}
        style={[styles.image, inState && styles.followingImage]}
      />
    );
  }

  render() {
    const { result, routeScene, resultType, sceneToRoute, propsToPass } = this.props;
    const name = result.username || result.name;
    const { inState } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => routeScene(sceneToRoute, propsToPass)}
        >
          <UserAvatar
            avatarUrl={result.avatarUrl}
            size={50}
            iconStyle={{ width: 22, height: 25 }}
          />
          <LabelText upperCase={true} style={styles.username}>{name}</LabelText>
        </TouchableOpacity>
        <TouchableHighlight
          style={[styles.button, inState && styles.following]}
          onPress={() => this.addToState(result, resultType)}
          underlayColor="#FFF"
        >
        {this.renderImage(inState)}
        </TouchableHighlight>
      </View>
    );
  }
}
