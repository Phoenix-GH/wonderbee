import { StyleSheet, Platform } from 'react-native';
import { STATUSBAR_HEIGHT, WINDOW_HEIGHT, NAVBAR_HEIGHT } from 'AppConstants';
import { WHITE, DARK_GRAY } from 'AppColors';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiveContainer: {
    flex: 1,
    height: null,
    width: null,
  },
  hiveGrid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: NAVBAR_HEIGHT,
  },
  topBar: {
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  actionBar: {
    flex: 1,
    flexDirection: 'row',
  },
  searchBar: {
    flex: 0.8,
  },
  createBar: {
    flex: 0.2,
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
  },
  searchInput: {
    fontFamily: 'Panton-Semibold',
    height: 35,
    lineHeight: 35,
    fontSize: 12,
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: WHITE,
    paddingLeft: WINDOW_HEIGHT / 20 + 10,
  },
  searchIconContainer: {
    position: 'absolute',
    top: -5,
    bottom: 0,
    justifyContent: 'center',
    marginLeft: 10,
  },
  searchIcon: {
    width: 30,
    height: 30,
    tintColor: DARK_GRAY,
  },
  iconAdd: {
    width: 38,
    height: 38,
  }
});
