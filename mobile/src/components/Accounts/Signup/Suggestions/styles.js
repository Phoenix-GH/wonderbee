import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { SECONDARY_TEXT, BG_MEDIUM_GRAY, YELLOW , BORDER_GRAY, SEMI_OPAQUE_BG } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  groupsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10
  },
  labelText: {
    marginLeft: 15
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  rowMainText: {
    fontWeight: '400'
  },
  rowActionButton: {
    borderColor: SEMI_OPAQUE_BG,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.6
  },
  rowContent: {
    marginRight: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  rowImage: {
    marginLeft: 15,
    marginRight: 10
  },
  rowIcon: {
    width: 40,
    height: 30
  },
  rowAddButtonContainer: {
    borderColor: BORDER_GRAY
  },
  rowIconContainer: {
    borderWidth: 1,
    borderColor: BG_MEDIUM_GRAY,
    borderRadius: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 10,
    paddingLeft: 10
  },
  rowSecondaryText: {
    color: SECONDARY_TEXT,
    flexWrap: 'wrap',
    maxWidth: WINDOW_WIDTH - 155,
  },
  footerContainer: {
    justifyContent: 'flex-start',
    marginLeft: 15,
    marginBottom: 20
  },
  footerText: {
    color: SECONDARY_TEXT
  },
  selected: {
    backgroundColor: YELLOW
  }
});
