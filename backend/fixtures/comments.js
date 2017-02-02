import app from '../src';
import faker from 'faker';
import CONSTANT from './constants';
import { getRandomId } from './util';

export const generateComments1 = () => {
  const promises = [];
  for (let i = 0; i < CONSTANT.COMMENTS_COUNT * 3 / 4; i++) {
    const commentSchema = {};
    promises.push(
      getRandomId('users')
      .then(userId => {
        commentSchema.userId = userId[0].id;
        return getRandomId('posts');
      })
      .then(postId => {
        commentSchema.postId = postId[0].id;
        commentSchema.comment = faker.lorem.paragraph(faker.random.number({ min: 1, max: 4 }));
        commentSchema.createdAt = faker.date.recent(4);
        return app.service('comments').create(commentSchema);
      })
      .catch(error => console.log('comment 1 error', error))
    );
  }
  return Promise.all(promises);
};

export const generateComments2 = () => {
  const promises = [];
  for (let i = 0; i < COMMENTS_COUNT / 4; i++) {
    let randomUserId;
    promises.push(getRandomId('users')
    .then(userId => {
      randomUserId = userId[0].id;
      return getRandomId('comments');
    })
    .then(commentId => {
      const commentSchema = {
        targetId: commentId[0].id,
        target: 'comment',
        comment: faker.lorem.paragraph(faker.random.number({ min: 1, max: 4 })),
        updatedAt: faker.date.recent(2),
        createdAt: faker.date.recent(4),
        createdBy: randomUserId,
      };
      return app.service('comments').create(commentSchema);
    })
    .catch(error => console.log('comment 2 error', error)));
  }
  return Promise.all(promises);
};
