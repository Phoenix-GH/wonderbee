import app from '../src';
const faker = require('faker');
import { getRandomId } from './util';
const CONSTANT = require('./constants');
const { VOTE_COUNT } = CONSTANT;

module.exports = () => {
  const promises = [];
  for (let i = 0; i < VOTE_COUNT; i++) {
    const target = Math.random() <= 0.5 ? 'post' : 'comment';
    const isImageVote = target === 'post' && Math.random() < 0.75;
    const upvote = target === 'post' || Math.random() <= 0.70;
    const voteSchema = { isImageVote, target, upvote };
    promises.push(
      getRandomId('users')
      .then(userId => {
        voteSchema.createdBy = userId[0].id;
        return getRandomId(`${target}s`);
      })
      .then(targetId => app.service(`${target}s`).get(targetId[0].id))
      .then(targetFinal => {
        voteSchema.targetId = targetFinal.id;
        if (target === 'post' && isImageVote) {
          if (targetFinal.images.length > 1) {
            const randomIndex = Math.floor(Math.random() * targetFinal.images.length);
            voteSchema.imageId = targetFinal.images[randomIndex].id;
          } else {
            voteSchema.position = {
              top: faker.random.number({ min: 0, max: 500 }),
              left: faker.random.number({ min: 0, max: 500 }),
            };
          }
        }
        return app.service('votes').create(voteSchema);
      })
      .catch(error => console.log(error))
    );
  }
  return Promise.all(promises);
};
