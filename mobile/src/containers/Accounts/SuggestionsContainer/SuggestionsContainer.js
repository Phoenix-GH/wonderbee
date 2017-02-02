import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  InteractionManager,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectFeathers } from 'AppConnectors';
import { SimpleTopNav, Suggestions, Loading, BackgroundAccounts } from 'AppComponents';
import { ActionButton } from 'AppButtons';
import { GROUP_SERVICE, USER_SERVICE, FOLLOWER_SERVICE } from 'AppServices';
import { WINDOW_HEIGHT, WINDOW_WIDTH, NAVBAR_HEIGHT } from 'AppConstants';
import { AlertMessage } from 'AppUtilities';
import { styles } from './styles';
import { SECONDARY_TEXT } from 'AppColors';

class SuggestionsContainer extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    connectFacebook: PropTypes.func.isRequired,
    addFromContacts: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
    signup: PropTypes.bool.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      groups: [],
      people: [],
      selectedGroups: [],
      selectedPeople: []
    };
    this.suggestionsRef = null;
    this.renderLoading = ::this.renderLoading;
    this.renderNotFound = ::this.renderNotFound;
    this.handleDone = ::this.handleDone;
    this.skip = ::this.skip;
  }

  componentWillMount() {
    const { feathers } = this.props;
    const groupsService = feathers.service(GROUP_SERVICE);
    const usersService = feathers.service(USER_SERVICE);
    const groups = [
      { id: 1, name: 'Box Office Hits', members: 402, img: 'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/1926783_653204088135991_3701184044511159740_n.jpg?oh=3dd1864c9326272896dd32e3d6c1ba6d&oe=581B4C9F' },
      { id: 2, name: 'Foodies Anonymous', members: 557, img: 'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/1926783_653204088135991_3701184044511159740_n.jpg?oh=3dd1864c9326272896dd32e3d6c1ba6d&oe=581B4C9F' },
      { id: 3, name: 'Artists & Makers', members: 300, img: 'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/1926783_653204088135991_3701184044511159740_n.jpg?oh=3dd1864c9326272896dd32e3d6c1ba6d&oe=581B4C9F' },
      { id: 4, name: 'Lancome Cosmetics', members: 631, img: 'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/1926783_653204088135991_3701184044511159740_n.jpg?oh=3dd1864c9326272896dd32e3d6c1ba6d&oe=581B4C9F' }
    ];
    let people = [];

    InteractionManager.runAfterInteractions(() => (
      groupsService.find({})
        .then(() => {
          const query = {
            $limit: 10,
            id: {
              $ne: feathers.get('user').id
            }
          };
          return usersService.find({ query });
        })
        .then(users => people = users)
        .then(() => this.setState({ groups, people, loading: false }))
        .catch((err) => AlertMessage.fromRequest(err))
    ));
  }

  skip() {
    return this.props.onSubmit();
  }

  handleDone() {
    const { onSubmit, feathers } = this.props;
    const { people } = this.suggestionsRef.getResult();
    const followerService = feathers.service(FOLLOWER_SERVICE);

    return followerService.create({ people })
      .then(() => onSubmit())
      .catch(err => AlertMessage.fromRequest(err));
  }

  renderLoading() {
    return <Loading />;
  }

  renderNotFound() {
    return (
      <View>
        <Text>Suggestions Not Found :(</Text>
      </View>
    );
  }

  render() {
    const { onBack, addFromContacts, connectFacebook, signup } = this.props;
    const { loading, groups, people } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (!loading && !people.length && !groups.length) {
      return this.renderNotFound();
    }

    return (
      <View style={styles.container}>
        {!signup ?
          <SimpleTopNav
            centerLabel="PEOPLE TO FOLLOW"
            centerFontSize={15}
            iconBack={true}
            leftAction={onBack}
            sideFontSize={14}
            rightLabel="DONE"
            rightAction={() => this.handleDone()}
          /> :
          <BackgroundAccounts
            style={styles.top}
            type={'green'}
            imageWidth={WINDOW_WIDTH}
            imageHeight={NAVBAR_HEIGHT}
          >
            <View>
              <Text style={styles.titleLabel} >
                Add and Invite Friends
              </Text>
            </View>
          </BackgroundAccounts>
        }
        <View style={styles.actionButtonsContainer}>
          {signup && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                justifyContent: 'center',
                marginBottom: 10,
                width: 0.9 * WINDOW_WIDTH
              }}
            >
              <Icon
                name="search"
                size={20}
                color={SECONDARY_TEXT}
                style={[
                  styles.icon,
                  { color: SECONDARY_TEXT },
                  { marginRight: 5 },
                  {
                    transform: [{
                      scaleX: -1,
                    }]
                  }
                ]}
              />
              <View style={{ borderBottomWidth: 1, flex: 1 }}>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Search..."
                  clearButtonMode="while-editing"
                  placeholderTextColor={SECONDARY_TEXT}
                />
              </View>
            </View>
          )}
          <ActionButton
            label="Add From Your Contacts"
            onPress={addFromContacts}
            upperCase={false}
            style={styles.actionButtons}
            labelStyle={[styles.actionButtonLabel, styles.bold]}
          />
          <ActionButton
            label={(
              <View style={styles.actionFacebook}>
                <Icon name="facebook-official" size={20} color="white" />
                <Text style={[styles.connectFacebook, styles.bold]}>Connect to Facebook</Text>
              </View>
            )}
            onPress={connectFacebook}
            upperCase={false}
            style={[styles.actionButtons, styles.facebook]}
            labelStyle={[styles.actionButtonLabel, styles.bold]}
          />
        </View>
        <Suggestions
          ref={(reference) => this.suggestionsRef = reference}
          groups={groups}
          people={people}
          scrollViewStyle={signup ? { height: WINDOW_HEIGHT - 300 } : {}}
        />
        {signup &&
        <View style={styles.bottom}>
          <TouchableOpacity onPress={onBack} style={styles.left} >
            <Text style={[styles.grayText, styles.bold]}>back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDone} style={styles.centerButton} >
            <Text style={[styles.whiteText, styles.bold, { textAlign: 'center' }]}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.skip} style={styles.right} >
            <Text style={[styles.grayText, styles.bold]}>skip</Text>
          </TouchableOpacity>
        </View>}
      </View>
    );
  }
}

export default connectFeathers(SuggestionsContainer);
