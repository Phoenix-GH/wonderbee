import React, { PropTypes } from 'react';
import GL from 'gl-react';

import {
  Normal,
  F1977,
  Amaro,
  Brannan,
  Earlybird,
  Hefe,
  Hudson,
  Inkwell,
  Lokofi,
  LordKelvin,
  Nashville,
  Rise,
  Sierra,
  Sutro,
  Toaster,
  Valencia,
  Walden,
  XproII,
} from 'gl-react-instagramfilters';

export const Filter = GL.createComponent(({ filter, children }) => {
  switch (filter) {
    case 'Retro': {
      return (
        <F1977>
          {children}
        </F1977>
      );
    }
    case 'Amaro': {
      return (
        <Amaro>
          {children}
        </Amaro>
      );
    }
    case 'Brannan': {
      return (
        <Brannan>
          {children}
        </Brannan>
      );
    }
    case 'Earlybird': {
      return (
        <Earlybird>
          {children}
        </Earlybird>
      );
    }
    case 'Hefe': {
      return (
        <Hefe>
          {children}
        </Hefe>
      );
    }
    case 'Hudson': {
      return (
        <Hudson>
          {children}
        </Hudson>
      );
    }
    case 'Inkwell': {
      return (
        <Inkwell>
          {children}
        </Inkwell>
      );
    }
    case 'Lokofi': {
      return (
        <Lokofi>
          {children}
        </Lokofi>
      );
    }
    case 'LordKelvin': {
      return (
        <LordKelvin>
          {children}
        </LordKelvin>
      );
    }
    case 'Nashville': {
      return (
        <Nashville>
          {children}
        </Nashville>
      );
    }
    case 'Rise': {
      return (
        <Rise>
          {children}
        </Rise>
      );
    }
    case 'Sierra': {
      return (
        <Sierra>
          {children}
        </Sierra>
      );
    }
    case 'Sutro': {
      return (
        <Sutro>
          {children}
        </Sutro>
      );
    }
    case 'Toaster': {
      return (
        <Toaster>
          {children}
        </Toaster>
      );
    }
    case 'Valencia': {
      return (
        <Valencia>
          {children}
        </Valencia>
      );
    }
    case 'Walden': {
      return (
        <Walden>
          {children}
        </Walden>
      );
    }
    case 'XproII': {
      return (
        <XproII>
          {children}
        </XproII>
      );
    }
    default: {
      return (
        <Normal>
          {children}
        </Normal>
      );
    }
  }
}, {
  displayName: 'Filter',
  propTypes: {
    filter: PropTypes.string,
    children: PropTypes.any.isRequired,
  }
});
