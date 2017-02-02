import React, { PropTypes, Component } from 'react';
import { imageToDataUri, shallowEqual } from 'AppUtilities';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
const startsWith = String.prototype.startsWith;

// Blank 1x1 transparent gif
const DEFAULT_HREF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export function createImageOverride(SvgImage) {
  return class extends Component {
    static propTypes = {
      href: PropTypes.any
    };

    constructor(props, context) {
      super(props, context);
      this._getImageSrc = ::this._getImageSrc;
      this.state = {
        href: null
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.state.href !== nextState.href || !shallowEqual(this.props, nextProps);
    }

    componentWillReceiveProps(nextProps) {
      this._updateSrc(nextProps.href);
    }

    componentWillMount() {
      this._updateSrc(this.props.href);
    }

    _updateSrc(src) {
      const isRes = !!src && typeof src === 'object' && src.uri;
      const isDataUrl = isRes && src.uri.startsWith('data:');

      if (isRes && ! isDataUrl) {
        this._getImageSrc(src).then((uri) => {
          this.setState({
            href: uri
          });
        });
      } else if (isDataUrl) {
        this.setState({
          href: src
        });
      }
    }

    async _getImageSrc(href) {
      const src = resolveAssetSource(href);
      const res = await imageToDataUri(src.uri);
      return { uri: res };
    }

    render() {
      const props = {
        ...this.props,
        href: this.state.href || DEFAULT_HREF
      };

      return (
        <SvgImage {...props} />
      );
    }
  };
}
