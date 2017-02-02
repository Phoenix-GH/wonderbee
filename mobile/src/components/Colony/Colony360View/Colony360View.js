import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { SpiralHexagonGrid, HexagonImage, SimpleTopNav } from 'AppComponents';
import { WINDOW_WIDTH, WINDOW_HEIGHT, NAVBAR_HEIGHT } from 'AppConstants';
import { WHITE } from 'AppColors';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: WINDOW_WIDTH,
    height: NAVBAR_HEIGHT,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
  },
});

export const Colony360View = ({ colonyName, topics, routeBack, showNavigationBar }) => (
  <View style={styles.container}>
    <SpiralHexagonGrid
      style = {{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
      spacing={-2.5}
      hexagonSize={WINDOW_WIDTH / 3 - 2}
      scrollEnabled={true}
    >
      {topics.map((topic, i) =>
        <HexagonImage
          key={i}
          imageSource={{ uri: topic.imageUrl }}
          size={WINDOW_WIDTH / 3 - 2}
          imageHeight={1.5 * (WINDOW_WIDTH / 3 - 2)}
          imageWidth={1.5 * (WINDOW_WIDTH / 3 - 2)}
          isHorizontal={true}
          borderColor={WHITE}
          borderWidth={5.5}
          onPress={topic.onPress}
        />
      )}
      </SpiralHexagonGrid>
    {showNavigationBar &&
      <SimpleTopNav
        topNavBar={true}
        centerLabel={colonyName}
        leftAction={routeBack}
        iconBack={true}
        wrapStyle={styles.header}
        centerFontSize={18}
      />}
  </View>
);

Colony360View.propTypes = {
  colonyName: PropTypes.string.isRequired,
  routeBack: PropTypes.func,
  showNavigationBar: PropTypes.bool.isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    isTrending: PropTypes.bool,
  })).isRequired,
};
