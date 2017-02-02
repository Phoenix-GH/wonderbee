import app from '../src';
const faker = require('faker');
import CONSTANTS from './constants';

export function generateUsers() {
  const promises = [];
  for (let i = 0; i < CONSTANTS.USERS_COUNT; i++) {
    const userOptions = {
      avatarUrl: faker.image.avatar(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      username: faker.internet.userName(),
      password: 'abcd1234',
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      gender: Math.random() <= 0.5 ? 'male' : 'female',
      yearOfBirth: faker.random.number({ min: 1950, max: 2010 }),
      bio: faker.lorem.sentence(),
      location: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
        name: `${faker.address.city()}, ${faker.address.country()}, ${faker.address.stateAbbr()}`
      },
    };
    promises.push(app.service('users').create(userOptions)
    .catch((error) => console.log('user error', error)));
  }
  return Promise.all(promises);
}
