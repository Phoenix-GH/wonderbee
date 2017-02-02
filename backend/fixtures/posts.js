import app from '../src';
const faker = require('faker');
import CONSTANTS from './constants';
import { getRandomId } from './util';

export function generatePosts() {
  const promises = [];
  for (let i = 0; i < CONSTANTS.POSTS_COUNT; i++) {
    promises.push(getRandomId('users')
    .then(userId => {
      const postSchema = {
        userId: userId[0].id,
        description: faker.lorem.paragraph(faker.random.number({ min: 1, max: 3 })),
        visibility: Math.random() < 0.5 ? 'all' : 'followers',
        expiresAt: Math.random() < 0.5 ? faker.date.future(0.2) : null,
        createdAt: faker.date.recent(5),
        voting: Math.random() < 0.5,
      };
      return app.service('posts').create(postSchema);
    })
    .catch(error => console.log('post error', error)));
  }
  return Promise.all(promises);
}


export function generateImages() {
  const promises = [];
  const promises2 = [];
  app.service('posts').find({ paginate: false })
  .then(posts => {
    posts.forEach(post => {
      const imageNum = Math.floor(Math.random() * 5);
      const maxImages = imageNum > 0 || imageNum === 2 ? imageNum : imageNum + 1;
      for (let i = 0; i < maxImages; i++) {
        const image = faker.random.number({ min: 5, max: 30 });
        const dims = 1000;
        const imageSchema = {
          order: i,
          postId: post.id,
          title: faker.lorem.sentence(),
          url: `https://unsplash.it/${dims}?image=${image}`,
          width: dims,
          height: dims,
        };
        promises.push(
          app.service('images').create(imageSchema)
          .catch(error => console.log(error))
        );
      }
      return promises2.push(Promise.all(promises));
    });
    return Promise.all(promises).then(() => promises2);
  });
}
