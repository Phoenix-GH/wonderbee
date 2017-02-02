import React, { PropTypes } from 'react';
import { View, Modal, Picker, StyleSheet } from 'react-native';
import { SimpleTopNav } from 'AppComponents';
import { BLUE } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export const PickerModal = ({
  data,
  selected,
  onChange,
  isVisible,
  title,
  onRequestClose
}) => (
  <Modal
    visible={isVisible}
    transparent={false}
    animationType={'slide'}
    onRequestClose={() => {}}
  >
    <SimpleTopNav
      leftLabel={'Close'}
      centerLabel={title}
      leftAction={onRequestClose}
    />
    <View style={styles.container}>
      <Picker
        onValueChange={onChange}
        selectedValue={selected}
      >
        {data.map((choice, i) => (
          <Picker.Item label={choice} value={choice} key={i} />
        ))}
      </Picker>
    </View>
  </Modal>
);

PickerModal.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired
};

PickerModal.defaultProps = {
  title: 'Select value'
};
