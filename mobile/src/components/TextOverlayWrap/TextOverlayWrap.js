import React, { PropTypes } from 'react';
import { TextOverlayNormal, TextOverlayBold, TextOverlayMeme, TextOverlayLabel, } from 'AppFonts';

export function TextOverlayWrap({ filterType, ...props }) {
  switch (filterType) {
    case 'bold':
      return <TextOverlayBold {...props} />;
    case 'meme':
      return <TextOverlayMeme {...props} />;
    case 'label':
      return <TextOverlayLabel {...props} />;
    case 'normal':
    default:
      return <TextOverlayNormal {...props} />;
  }
}

TextOverlayWrap.propTypes = {
  filterType: PropTypes.string.isRequired,
};
