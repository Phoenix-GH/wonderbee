import * as RNSvg from 'react-native-svg';
import { SVG } from 'AppOverrides';

// Add URL support for svg images
RNSvg.Image = SVG.createImageOverride(RNSvg.Image);
