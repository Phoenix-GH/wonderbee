import React from 'react';
import { FeathersWrapper } from 'AppConnectors';
import config from 'AppConfig';
import { globalInjector } from 'AppUtilities';
import Buffer from 'buffer';
import { Router } from './Router';

const injectGlobals = globalInjector();

injectGlobals({
  Buffer: [Buffer, false]
});

export const App = () => (
  <FeathersWrapper
    wsEndpoint={config.WSOCKET}
    loader={ null /* You can add a component here (eg. {<Loader />} */ }
    timeout={60000}
  >
    <Router />
  </FeathersWrapper>
);
