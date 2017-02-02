import qs from 'qs';
import request from 'request';

export default class GeolocationService {

  constructor(options) {
    const { language, key, types } = options;
    const defaultOptions = {
      radius: 50000,
    };
    if (!language || !key || !types) {
      throw new Error(500, 'Can\'t construct Geolocation service');
    }
    this._options = Object.assign({}, defaultOptions, options);
  }

  find({ query }) {
    switch (query.types) {
      case 'combination':
        return this._searchForCombinations(query);
      case 'current':
        return this._getCurrentLocation(query);
      default:
        return this._searchAllTypes(query);
    }
  }

  _getCurrentLocation({ location }) {
    const API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${this._options.key}&result_type=locality`;
    return new Promise((resolve, reject) => {
      request(API, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        const jsonParsed = JSON.parse(body);
        return resolve(jsonParsed.results[0]);
      });
    });
  }

  _searchAllTypes({ name = '', types = this._options.type, location }) {
    const API = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${name}&types=${types}&location=${location}&radius=${this._options.radius}&key=${this._options.key}`;
    return new Promise((resolve, reject) => {
      request(API, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        try {
          const jsonBody = JSON.parse(body);
          return resolve(jsonBody.predictions || jsonBody);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  _searchForCombinations(query) {
    const locations = [];
    return this._searchPlaces(query)
      .then((results) => {
        locations.push(...results);
        return this._searchAllTypes({
          ...query,
          types: this._options.types,
        });
      })
      .then(locationsGroup => {
        locations.push(...locationsGroup);
      })
      .then(() => locations);
  }

  _searchPlaces(params) {
    const { location, name } = params;
    const API = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${name}&types=establishment&location=${location}&radius=${this._options.radius}&key=${this._options.key}`;
    return new Promise((resolve, reject) => {
      request(API, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        try {
          const jsonObject = JSON.parse(body);
          console.log(jsonObject);
          return resolve(jsonObject.predictions);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  get(id) {
    const options = Object.assign({}, this._options, {
      placeid: id,
    });
    const API = `https://maps.googleapis.com/maps/api/place/details/json?&${qs.stringify(options)}`;
    return new Promise((resolve, reject) => {
      request(API, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        const jsObject = JSON.parse(body);
        return resolve(jsObject);
      });
    });
  }

  setup(app) {
    this.app = app;
  }
}
