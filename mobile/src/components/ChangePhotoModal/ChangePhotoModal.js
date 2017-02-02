import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-native';
import { ActionSheet } from 'AppComponents';
import { WHITE } from 'AppColors';

const tintColor = WHITE;

export class ChangePhotoModal extends Component {
  static propTypes = {
    routeScene: PropTypes.func.isRequired,
    removeProfilePic: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isVisibleModal: false,
    };
    this.toggleModal = ::this.toggleModal;
    this.handleActionSheet = ::this.handleActionSheet;
    this.routeScene = ::this.routeScene;
    this.removeProfilePic = ::this.removeProfilePic;
    this.onAvatarSave = ::this.onAvatarSave;
    this.PROFILE_PHOTO_OPTIONS = [
      // { label: 'PHOTO LIBRARY', icon: require('img/icons/icon_camera_roll.png'), iconStyle:
      //   { height: 25, width: 30, tintColor },
      //   onPress: () => this.routeScene('CameraRollScene', { mask: true }),
      // },
      { label: 'CAMERA', icon: require('img/icons/icon_camera_outline.png'), iconStyle:
        { height: 25, width: 30, tintColor },
        onPress: () =>
          this.routeScene('AvatarCameraScene', { onAvatarSave: this.onAvatarSave }),
      },
      { label: 'REMOVE', icon: require('img/icons/icon_cancel.png'), iconStyle:
        { height: 25, width: 25, tintColor },
        onPress: this.removeProfilePic,
      },
      { label: 'CANCEL' }
    ];
  }

  toggleModal() {
    this.setState({
      isVisibleModal: !this.state.isVisibleModal,
    });
  }

  handleActionSheet(index) {
    if (index === this.PROFILE_PHOTO_OPTIONS.length - 1) {
      this.setState({ isVisibleModal: false });
    }
  }

  onAvatarSave(avatarUrl) {
    this.props.onAvatarSave(avatarUrl);
  }

  routeScene(scene, props = null) {
    this.setState({ isVisibleModal: false });
    this.props.routeScene(scene, props);
  }

  removeProfilePic() {
    this.setState({ isVisibleModal: false });
    this.props.removeProfilePic();
  }

  render() {
    const { isVisibleModal } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisibleModal}
        onRequestClose={this.toggleModal}
      >
        <ActionSheet
          options={this.PROFILE_PHOTO_OPTIONS}
          cancelButtonIndex={2}
          callback={this.handleActionSheet}
        />
      </Modal>
    );
  }
}
