import React, { PropTypes } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BLACK } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  icon: {
    height: 28,
    width: 28,
    tintColor: BLACK,
  }
});

export function ProfilePostControl({ setFeedStyle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFeedStyle('tile')}>
        <Image source={require('img/icons/icon_profile_grid.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFeedStyle('list')}>
        <Image
          source={require('img/icons/icon_nav_list.png')}
          style={[styles.icon]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFeedStyle('360')}>
        <Image source={require('img/icons/icon_profile_colony.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

ProfilePostControl.propTypes = {
  setFeedStyle: PropTypes.func.isRequired,
};
