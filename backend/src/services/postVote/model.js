import Sequelize from 'sequelize';

export default function (sequelize) {
  const postVoteSchema = sequelize.define('postVote', {
    postId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
    emojiId: {
      type: Sequelize.BIGINT,
    },
  });

  // sync the defined schema above to the database
  postVoteSchema.sync();

  return postVoteSchema;
}
