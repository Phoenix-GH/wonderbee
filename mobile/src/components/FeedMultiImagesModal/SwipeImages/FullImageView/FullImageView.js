import React, { PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TextOverlayWrap } from 'AppComponents';
import { SimpleViewEditor } from 'react-native-view-editor';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { TextRegular } from 'AppFonts';
import { WHITE } from 'AppColors';

const styles = StyleSheet.create({
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: WHITE,
  },
  text: {
    color: WHITE,
  },
  tag: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: WHITE,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top: 20,
  },
  iconBack: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  iconTop: {
    marginHorizontal: 5,
    width: 20,
    height: 20,
    tintColor: WHITE,
  }
});


export function FullImageView({ image, tagsActive, routeBack, activateTags }) {
  const isLandscape = image.height < image.width * 1.2;
  let initialScale = WINDOW_WIDTH / image.width < WINDOW_HEIGHT / image.height ?
    WINDOW_WIDTH / image.width : WINDOW_HEIGHT / image.height;
  if (isLandscape) {
    initialScale = WINDOW_WIDTH / image.height > WINDOW_HEIGHT / image.width ?
      WINDOW_WIDTH / image.height : WINDOW_HEIGHT / image.width;
  }
  return (
    <View style={styles.container}>
      <SimpleViewEditor
        imageWidth={image.width}
        imageHeight={image.height}
        isLandscape={isLandscape}
      >
        <Image
          source={{ uri: image.url }}
          style={[{
            width: image.width,
            height: image.height,
          }, isLandscape && { transform: [{ rotate: '90deg' }] }]}
        >
          {image.textOverlays &&
            image.textOverlays.length > 0 &&
            image.textOverlays.map((text, i) => (
            <TextOverlayWrap
              key={i}
              filterType={text.filterType}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: [
                  { translateX: text.pan.x - text.size.width * initialScale / 2 },
                  { translateY: text.pan.y + text.size.height * initialScale / 2 },
                  { scale: text.scale / initialScale },
                  { rotate: text.rotate },
                ]
              }}
            >
              {text.text}
            </TextOverlayWrap>
          ))}
          {tagsActive &&
            image.imageTags &&
            image.imageTags.length > 0 &&
            image.imageTags.map((text, i) => (
              <TextRegular
                key={i}
                style={[styles.tag, {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: [
                    { translateX: text.x },
                    { translateY: text.y },
                    { scale: 1 / initialScale },
                  ]
                }]}
              >
                {text.text}
              </TextRegular>
          ))}
        </Image>
      </SimpleViewEditor>
      {image.location && (
        <View style={styles.location}>
          <Image source={require('img/icons/icon_location.png')} style={styles.icon} />
          <TextRegular style={styles.text}>{image.location.city}</TextRegular>
        </View>
      )}
      <View style={styles.topRow}>
        {image.imageTags &&
        image.imageTags.length > 0 ? (
          <TouchableOpacity style={styles.iconBack} onPress={activateTags}>
            <Image style={styles.iconTop} source={require('img/icons/icon_posting_pin.png')} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <TouchableOpacity style={styles.iconBack} onPress={routeBack}>
          <Image style={styles.iconTop} source={require('img/icons/icon_cancel.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

FullImageView.propTypes = {
  tagsActive: PropTypes.bool.isRequired,
  image: PropTypes.object.isRequired,
  routeBack: PropTypes.func.isRequired,
  activateTags: PropTypes.func.isRequired,
};
