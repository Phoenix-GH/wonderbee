module.exports = (function io() {
  if (! window.navigator || ! window.navigator.hasOwnProperty('userAgent')) {
    Object.assign(window, { navigator: { userAgent: 'ReactNative' } });
  }
  return require('socket.io-client/socket.io');
}());
