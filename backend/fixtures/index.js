import { generateUsers } from './users';
import { generatePosts, generateImages } from './posts';
import { generateComments1 } from './comments';
import { generateEmojis } from './emojis';

function fixtures() {
  console.log('Started app and running fixtures...');
  return generateUsers()
  .then(() => generatePosts())
  .then(() => generateImages())
  .then(() => generateComments1())
  // .then(() => generateComments.generateComments1())
  // .then(() => generateComments.generateComments2())
  // .then(() => generateMessages())
  // .then(() => generateVotes())
  .then(() => {
    console.log('Fixtures run successfully!');
    process.exit();
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
}

fixtures();
