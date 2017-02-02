import app from '../src';
const faker = require('faker');

export const getRandomHashtags = (min = 0, max = 5) => {
  const hashTags = [];
  const limit = faker.random.number({ min, max });
  if (limit > 0) {
    for (let i = 0; i < limit; i++) {
      hashTags.push(faker.lorem.word());
    }
  }
  return hashTags;
};

export const getRandomId = (collection) => (
  app.service(collection).find({ paginate: false })
  .then(result => {
    const $skip = faker.random.number({ min: 0, max: result.length - 1 });
    return {
      $select: ['id'],
      $sort: { id: 1 },
      $limit: 1,
      $skip,
    };
  })
  .then(query => app.service(collection).find({ query, paginate: false }))
);

export const getRandomHandles = (min = 0, max = 3) => {
  const promises = [];
  const limit = faker.random.number({ min, max });
  if (limit > 0) {
    for (let i = 0; i < limit; i++) {
      promises.push(
        getRandomId('users')
        .then(user => ({ usernames: user[0].username, ids: user[0].id }))
      );
    }
  }
  return Promise.all(promises);
};
