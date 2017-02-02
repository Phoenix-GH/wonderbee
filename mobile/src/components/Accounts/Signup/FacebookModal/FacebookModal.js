import React, { Component, PropTypes } from 'react';
import { WebView, Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { WSOCKET } from 'AppConfig';
import { WINDOW_WIDTH, WINDOW_HEIGHT, STATUSBAR_HEIGHT } from 'AppConstants';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  web: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - STATUSBAR_HEIGHT,
    marginTop: STATUSBAR_HEIGHT,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: WINDOW_WIDTH,
    height: 45,
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
  },
  headerText: {
    paddingLeft: 5,
    color: WHITE,
  }
});

export class FacebookModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
  };
  constructor(props, context) {
    super(props, context);
    this.authUrl = `${WSOCKET}/auth/facebook`;
    this.state = {
      doneEnabled: false
    };
  }

  render() {
    const { isVisible, onCancel } = this.props;
    const { doneEnabled } = this.state;
    return (
      <Modal animationType="slide" visible={isVisible} >
        <View style={styles.container}>
          { isVisible && <WebView
            source={{ uri: this.authUrl }}
            style = {styles.web}
            onLoad={() => this.setState({ doneEnabled: true })}
            scrollEnabled={false}
            bounces={false}
          />
          }
          { doneEnabled && (
            <View style={styles.header}>
              <TouchableOpacity onPress={onCancel} >
                <Text style={[styles.headerText]}>DONE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}
