import Sequelize from 'sequelize';

export default function (sequelize) {
  const imageVoteSchema = sequelize.define('imageVote', {
    imageId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
  });

  // sync the defined schema above to the database
  imageVoteSchema.sync();

  return imageVoteSchema;
}
