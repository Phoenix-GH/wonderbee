import { AsyncStorage } from 'react-native';

export class Storage {
  constructor(key) {
    this._key = key;
  }

  async setItem(key, value) {
    return AsyncStorage.setItem(`@${this._key}:${key}`, value);
  }

  async getItem(key) {
    return AsyncStorage.getItem(`@${this._key}:${key}`);
  }


  async removeItem(key) {
    return AsyncStorage.removeItem(`@${this._key}:${key}`);
  }

  async setJSON(key, value) {
    return this.setItem(key, JSON.stringify(value));
  }

  async getJSON(key) {
    const value = await this.getItem(key);
    return JSON.parse(value);
  }
}
