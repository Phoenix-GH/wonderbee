import GeolocationService from './geolocationService';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  app.use('/geolocation', new GeolocationService({
    language: 'en',
    types: '(regions)',
    key: app.get('googlePlaces').API_KEY,
  }));

  app.service('geolocation').before(before).after(after);
}
