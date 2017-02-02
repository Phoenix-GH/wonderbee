/**
 * @providesModule AppConfig
 */
try {
  module.exports = require('../appconfig.js');
} catch (e) {
  module.exports = {
    WSOCKET: 'http://172.20.1.100:3030',
    GCM_PROJECT_NUMBER: '368728387626'
  };
}
