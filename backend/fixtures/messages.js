import app from '../src';
const faker = require('faker');
const CONSTANT = require('./constants');
const { THREAD_COUNT, MESSAGE_COUNT } = CONSTANT;
import { getRandomHandles } from './util';

const generateSingleMessage = (thread) => (
  {
    message: faker.lorem.paragraph(faker.random.number({ min: 1, max: 3 })),
    threadId: thread.id,
    createdBy: thread.involved[Math.floor(Math.random() * thread.involved.length)],
    createdAt: faker.date.recent(5),
    updatedAt: faker.date.recent(2),
  }
);

const generateMessage = () => (
  getRandomHandles(1, 5)
  .then(handles => {
    const threadSchema = {
      involved: handles.usernames,
      read: handles.filter(() => Math.random() < 0.3),
      createdBy: handles.ids[0],
      createdAt: faker.date.recent(10),
      updatedAt: faker.date.recent(2),
    };
    return app.service('threads').find({ query: threadSchema })
    .then((thread) => app.service('threads').update(thread[0].id, threadSchema))
    .catch(() => app.service('threads').create(threadSchema));
  })
  .then(thread => {
    const promises = [];
    for (let j = 0; j < MESSAGE_COUNT; j++) {
      promises.push(generateSingleMessage(thread));
    }
    return Promise.all(promises);
  })
  .catch(error => console.log('generatMessage ', error))
);

module.exports = () => {
  for (let t = 0; t < THREAD_COUNT; t++) {
    const randomInvolved = faker.random.number({ min: 1, max: 5 });
    for (let k = 0; k < randomInvolved; k++) {
      generateMessage();
    }
  }
};
