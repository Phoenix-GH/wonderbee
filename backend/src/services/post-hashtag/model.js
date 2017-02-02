import Sequelize from 'sequelize';

export default function (sequelize) {
  const postHashtag = sequelize.define('postHashtag', {
    postId: {
      type: Sequelize.BIGINT,
    },
    hashtagId: {
      type: Sequelize.BIGINT,
    },
  });

  // sync the defined schema above to the database
  postHashtag.sync();

  return postHashtag;
}
