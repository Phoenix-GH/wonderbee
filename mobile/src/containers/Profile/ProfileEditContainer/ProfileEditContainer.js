import React, { Component, PropTypes } from 'react';
import { View, Alert } from 'react-native';
import {
  ProfileEditForm,
  SimpleTopNav,
  AvatarEdit,
} from 'AppComponents';
import { connectFeathers } from 'AppConnectors';
import { USER_SERVICE } from 'AppServices';
import { styles } from './styles';
import { WHITE, BLUE } from 'AppColors';

class ProfileEditContainer extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    routeBack: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: Object.assign({}, props.feathers.get('user')),
      submitting: false,
      currentAvatarUrl: props.feathers.get('user').avatarUrl
    };
    this.onAvatarSave = ::this.onAvatarSave;
    this.onAvatarEdit = ::this.onAvatarEdit;
    this.onRouteBack = ::this.onRouteBack;
    this.saveProfile = ::this.saveProfile;
    this.removeProfilePic = ::this.removeProfilePic;
  }

  onRouteBack() {
    const { user, currentAvatarUrl } = this.state;
    user.avatarUrl = currentAvatarUrl;
    this.props.routeBack();
  }

  onAvatarEdit() {
    this.props.routeScene('AvatarCameraScene', { onAvatarSave: this.onAvatarSave });
  }

  onAvatarSave(avatarUrl) {
    const { user } = this.state;
    user.avatarUrl = avatarUrl;
    this.setState({ user });
  }

  removeProfilePic() {
    const { user } = this.state;
    user.avatarUrl = '';
    this.setState({ user });
  }

  async saveProfile(_values) {
    this.setState({ submitting: true });
    const values = Object.assign({}, _values, {
      avatarUrl: this.state.user.avatarUrl
    });

    try {
      const { feathers } = this.props;
      const user = feathers.get('user');
      const userId = user.id;
      await feathers.service(USER_SERVICE).patch(userId, values);
      feathers.set('user', {
        ...user,
        ...values
      });
      this.props.routeBack();
    } catch (error) {
      Alert.alert('Failed to update profile', error.message);
    }
  }

  render() {
    const {
      user: { name, bio, avatarUrl },
      submitting,
    } = this.state;
    return (
      <View>
        <SimpleTopNav
          centerLabel="EDIT PROFILE"
          leftAction={this.onRouteBack}
          iconBack={true}
          color={WHITE}
        />
        <View>
          <AvatarEdit
            style={[styles.margin, { alignSelf: 'center' }]}
            avatarUrl={avatarUrl}
            onPress={this.onAvatarEdit}
            text={null}
            onRemove={this.removeProfilePic}
          />
          <ProfileEditForm
            name={name}
            bio={bio}
            submitting={submitting}
            onSubmit={this.saveProfile}
          />
        </View>
      </View>
    );
  }
}

export default connectFeathers(ProfileEditContainer);
